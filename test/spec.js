const Application = require('spectron').Application
const assert = require('assert')//from mocha
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')
const { isViewHidden } = require('./test-modules')

describe('Application launch', function () {
  this.timeout(20000)

  
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
  this.timeout(20000)/
  before('start application',function () {
    this.app = new Application({

      path: electronPath,

      // The following line tells spectron to look and use the main.js file
      // and the package.json located 1 level above.
      args: [path.join(__dirname, '..')]
    })
    return this.app.start()
  })

  
  // after('close application',function () {
  //   if (this.app && this.app.isRunning()) {
  //     return this.app.stop();
  //   }
  // })

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

      it('creates an entry', function () {
        
        return this.app.client.execute(async function () {
          var pass = false;
          // check number of entries
          var count1 = document.querySelector('#files').children.length;
          console.log('test: create entry - var count1:', count1);
          // click create 
          $('#e-create').click();
          // test.slee(10);
          // enter text input form field into fields
          document.querySelector('#new-entry-body').value = "CREATE test successful :)";
          // click submit 
          $('#btn-submit').click();
         
          

          await test.sleep(100);
          function checkCount() {
            //check number of entries = original number + 1
            var count2 = document.querySelector('#files').children.length;
            console.log('test: create entry - var count1:', count1);
            console.log('test: create entry - var count2:', count2);
            if ((++count1) == count2) {
              pass = true;
            }
            return pass;
          }
          return checkCount();
        }).then((pass) => assert.equal(pass, true))
        
      })//end of function (){})
     

    })

    describe('READ', function () {

    })

    describe('UPDATE', function () {

    })

    describe('DELETE', function () {

    })

    
  })

})//Application