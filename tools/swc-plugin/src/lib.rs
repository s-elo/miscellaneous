use swc_core::ecma::{
    ast::*,
    transforms::testing::test_inline,
    visit::{visit_mut_pass, VisitMut, VisitMutWith}
};
use swc_core::{
    common::Spanned
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

use serde::{Deserialize, Serialize};

pub struct TransformVisitor {
    config: Config,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    replace_str: String,
}

impl VisitMut for TransformVisitor {
    // Implement necessary visit_mut_* methods for actual custom transform.
    // A comprehensive list of possible visitor methods can be found here:
    // https://rustdoc.swc.rs/swc_ecma_visit/trait.VisitMut.html
    fn visit_mut_bin_expr(&mut self, e: &mut BinExpr) {
        e.visit_mut_children_with(self);

        if e.op == op!("===") {
            e.left = Box::new(Ident::new_no_ctxt(self.config.replace_str.clone().into(), e.left.span()).into());
        }
    }
}

/// An example plugin function with macro support.
/// `plugin_transform` macro interop pointers into deserialized structs, as well
/// as returning ptr back to host.
///
/// It is possible to opt out from macro by writing transform fn manually
/// if plugin need to handle low-level ptr directly via
/// `__transform_plugin_process_impl(
///     ast_ptr: *const u8, ast_ptr_len: i32,
///     unresolved_mark: u32, should_enable_comments_proxy: i32) ->
///     i32 /*  0 for success, fail otherwise.
///             Note this is only for internal pointer interop result,
///             not actual transform result */`
///
/// This requires manual handling of serialization / deserialization from ptrs.
/// Refer swc_plugin_macro to see how does it work internally.
#[plugin_transform]
pub fn process_transform(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    // let mut visitor = TransformVisitor;
    let config = serde_json::from_str::<Config>(
        &metadata.get_transform_plugin_config().unwrap()
    ).unwrap();
    println!("config: {:?}", config);
    // program.visit_mut_with(&mut visitor);
    // program
    program.apply(visit_mut_pass(TransformVisitor {
        config,
    }))
}

// An example to test plugin transform.
// Recommended strategy to test plugin's transform is verify
// the Visitor's behavior, instead of trying to run `process_transform` with mocks
// unless explicitly required to do so.
test_inline!(
    Default::default(),
    |_| visit_mut_pass(TransformVisitor {
        config: Config {
            replace_str: "kdy1".to_string(),
        },
    }),
    boo,
    // Input codes
    r#"foo === bar;"#,
    // Output codes after transformed with plugin
    r#"kdy1 === bar;"#
);