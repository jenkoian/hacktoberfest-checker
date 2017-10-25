const url = 'http://localhost:5000/';
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let window, $;
function loadWebPage(done) {

  function handleWebPage(dom) {

    function waitForScripts() {
      window = dom.window;
      $ = dom.window.jQuery;
      done();
    }
    dom.window.onload = waitForScripts;
  }

  const options = { resources: 'usable', runScripts: 'dangerously' };
  JSDOM.fromURL(url, options).then(handleWebPage);

}
function closeWebPage() {
  window.close();
}

describe('The web page', () => {

  beforeAll(loadWebPage);
  afterAll(closeWebPage);

  it('has the correct URL', () => {
    expect(window.location.href).toBe(url);
  });

});