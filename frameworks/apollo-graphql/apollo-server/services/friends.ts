export class FriendsService {
  async getFriends() {
    return [{ name: 'John Doe' }, { name: 'Jane Doe' }, { name: 'Jim Doe' }];
  }
}

export const friendsService = new FriendsService();
