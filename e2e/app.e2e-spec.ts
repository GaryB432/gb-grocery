import { GbGroceryPage } from './app.po';

describe('gb-grocery App', () => {
  let page: GbGroceryPage;

  beforeEach(() => {
    page = new GbGroceryPage();
  });

  it('should display welcome message', (done) => {
    page.navigateTo();
    page.getParagraphText()
      .then((msg) => expect(msg).toEqual('Welcome to gbg!!'))
      .then(done, done.fail);
  });
});
