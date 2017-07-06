import { browser, by, element } from 'protractor';

export class GbGroceryPage {
  public navigateTo() {
    return browser.get('/');
  }

  public getParagraphText() {
    return element(by.css('gbg-root h1')).getText();
  }
}
