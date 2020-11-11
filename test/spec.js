const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')
const { isViewHidden } = require('./test-modules')

describe('Application launch', function () {
  this.timeout(10000)

  
  before('start application',function () {
    this.app = new Application({

      path: electronPath,

      // The following line tells spectron to look and use the main.js file
      // and the package.json located 1 level above.
      args: [path.join(__dirname, '..')]
    })
    return this.app.start()
  })

  
  after('close application',function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  })

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1)
      // Please note that getWindowCount() will return 2 if `dev tools` are opened.
      // assert.equal(count, 2)
    })
  })
})//Application describe functions end


describe('Application checks', function () {
  this.timeout(10000)
  before('start application',function () {
    this.app = new Application({

      path: electronPath,

      // The following line tells spectron to look and use the main.js file
      // and the package.json located 1 level above.
      args: [path.join(__dirname, '..')]
    })
    return this.app.start()
  })

  
  after('close application',function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  })

  describe ('View' , function() {
    // Test preload.js & main.js
  describe ('default', function() {
    
      it('shows entry view', function() {

        return this.app.client.execute(function () {
          return test.isViewHidden('#entry-view');
        }).then((hidden)=> assert.equal(hidden, false));
        
      })
  
      it('hides new entry view form', function() {
        return this.app.client.execute(function () {
          return test.isViewHidden('#new-entry-view');
        }).then((hidden) => assert.equal(hidden,true));
      })
  })
  
  describe ('when add entry is clicked', function () {
    before('create entry button clicked',function () {
      this.app.client.execute(function () {
        document.querySelector('#e-create').click();
      });
    })
    it('hides entry view', function() {
      return this.app.client.execute(function () {
       return test.isViewHidden('#entry-view');
      }).then( (hidden) => assert.equal(hidden,true));
    })

    it('shows new entry view form', function () {
      return this.app.client.execute(function () {
        return test.isViewHidden('#new-entry-view');
      }).then((hidden) => assert.equal(hidden,false));
    })

  })
  

  
})//View

//PIPELINE CHECK
  

  // CRUD - preload.js checks - call preload methods directly


  // CRUD - MAIN.js checks - call main.js 

  // CRUD - emulate user C.R.U.D. input from front end js scripts
  describe('ENTRY C.R.U.D.', function() {

    describe('CREATE', function () {

      
      // check number of entries
      // click create 
      // enter text input form field into fields
      // click submit 
      //check number of entries = original number + 1

    })

    describe('READ', function () {

    })

    describe('UPDATE', function () {

    })

    describe('DELETE', function () {

    })

    
  })

})//Application