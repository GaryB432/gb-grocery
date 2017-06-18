import { browser, by, element } from 'protractor';

export class GbGroceryPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('gbg-root h1')).getText();
  }
}
