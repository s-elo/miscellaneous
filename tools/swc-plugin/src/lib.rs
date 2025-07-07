use swc_core::ecma::{
    ast::*,
    transforms::testing::test_inline,
    visit::{visit_mut_pass, VisitMut, VisitMutWith}
};
use swc_core::{
    common::{Spanned}
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

use serde::{Deserialize, Serialize};

use swc_ecma_quote::quote;

pub struct TransformVisitor {
    config: Config,
    visited_macros: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Macro {
    name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    replace_str: String,
    macros: Vec<Macro>,
}

fn create_import_declaration(module_name: &str, imports: &[String]) -> ModuleItem {
    let mut specifiers = imports.join(", ");
    println!("specifiers: {:?}", specifiers);
    specifiers.push_str(",");
    quote!(
        "import { $specifiers } from \"$module_name\"" as ModuleItem,
        module_name: Str = module_name.into(),
        specifiers = specifiers.into()
    )
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

    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        println!("visit_mut_ident: {:?}", ident.sym.to_string());
        if self.config.macros.iter().any(|m| m.name == ident.sym.to_string()) {
            self.visited_macros.push(ident.sym.to_string());
        }
    }

    fn visit_mut_program(&mut self, p: &mut Program) {
        println!("visit_mut_program");
        p.visit_mut_children_with(self);
        println!("visited_macros: {:?}", self.visited_macros);

        // self.visited_macros.push("test".to_string());

        let imports = create_import_declaration("macros", &self.visited_macros);

        if let Program::Module(m) = p {
            m.body.insert(0, imports);
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
        &metadata.get_transform_plugin_config().expect("failed to get plugin config for TransformVisitor")
    ).expect("Invalid plugin config for TransformVisitor");
    println!("config: {:?}", config);
    // program.visit_mut_with(&mut visitor);
    // program
    program.apply(visit_mut_pass(TransformVisitor {
        config,
        visited_macros: vec![],
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
            replace_str: "leo".to_string(),
            macros: vec![Macro { name: "i18n".to_string() }],
        },
        visited_macros: vec![],
    }),
    boo,
    // Input codes
    r#"foo === bar;"#,
    // Output codes after transformed with plugin
    r#"leo === bar;"#
);