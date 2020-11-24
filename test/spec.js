const Application = require('spectron').Application
const assert = require('assert')//from mocha
const { create } = require('domain')
const { app } = require('electron')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')
const { update } = require('../js/helpers/e-crud/e-update')

// note for console css styling - global var cannot be accessed from mocha context const css = 'color: green; font-style: italic; font-size:30px';

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
          
          console.log('%c TEST.js: Create Entry : #e-body value : var count1 = '+ count1, 'color: green; font-style: italic; font-size:10px');
          // click create 
          $('#e-create').click();
          await test.sleep(10);
          // enter text input form field into fields
          document.querySelector('#new-entry-body').value = "CREATE test successful :)";
          // click submit 
          $('#btn-submit').click();


          //check if number of files has increase by 1
          function checkCount() {
            //check number of entries = original number + 1
            var count2 = document.querySelector('#files').children.length;
            
          console.log('%c TEST.js: Create Entry : #e-body value : var count1 = '+ count1, 'color: green; font-style: italic; font-size:10px');

            
            console.log('%c TEST.js: Create Entry : #e-body value : var count2 = '+ count2, 'color: green; font-style: italic; font-size:10px');

            if ((++count1) == count2) {
              pass = true;
            }
            return pass;
          }
          
         pass = await test.sleep(10).then(() => {return checkCount();});
          
          return pass;
        }).then((pass) => assert.equal(pass, true))
        
      })//end of function (){})
     

    })

    describe('READ', function () {
      it('reads entry', function () {
        return this.app.client.execute(async function() {
          var pass = false;
  
          //click on last entry
          $('#files .active.entry').click();

          await test.sleep(10);
            
          //entry body should contant test of CREATE test
          var text = document.querySelector('#e-body').innerHTML;
          
          console.log('%c TEST.js: Read Entry : #e-body value : var text = '+ text, 'color: green; font-style: italic; font-size:10px');

          if (text == "CREATE test successful :)") {
            pass = true;
          }
          return pass;
          
        }).then((pass) => assert.equal(pass,true));
      })
    })

    describe('UPDATE', function () {
      it('updates entry', function () {
        return this.app.client.execute( async function () {
          var pass = false;
          var read = '#e-body';
          var write = '#new-entry-body'

          //click active entry 
          $('#files .active.entry').click();
          await test.sleep(5);// GUI - wait for file info to be retrieved
          
          // check text - read
          var text =  document.querySelector(read).innerHTML;
          console.log('%c TEST.js: Update Entry : #e-body value : var text = '+ text, 'color: green; font-style: italic; font-size:10px');

          // click update
          $('#e-update').click();
          await test.sleep(5); //GUI - wait for info update

          // enter change - write 
          var updatedText = " Update to the entry test.";
          document.querySelector(write).innerHTML = updatedText;
          console.log('%c TEST.js: Update Entry : #e-body value : var updateText = '+ updateText, 'color: green; font-style: italic; font-size:10px');

          await test.sleep(5);

          //click submit update
          // $('#btn-submit-update').click();
          $('#btn-submit-update').click();
          await test.sleep(5);//wait for GUI updates

          //select active entry
          $('#files .active.entry').click();

          await test.sleep(5);
          // ensure entry body matches newText - read
          var text2 = document.querySelector(read).innerHTML;
          
          console.log('%c TEST.js: Update Entry : #e-body.innerHTML : var text2 = '+ text2, 'color: green; font-style: italic; font-size:10px');


          if (text2 == updatedText) {
            pass = true;
          }
          return pass;
        }).then((pass => assert.equal(pass, true))); 
      })
    })

    describe('DELETE', function () {

      it('deletes an entry', function () {

        return this.app.client.execute( async function () {
          var pass = false;
          var testText = "DELETE entry test";
          //create and entry
          $('#e-create').click();
          await test.sleep(10);
          // enter text input form field into fields
          document.querySelector('#new-entry-body').value = testText;
          // click submit 
          $('#btn-submit').click();
          
          await test.sleep(15)//wait for entry to be submitted and gui to update
        
          //click active entry
          $('#files .active.entry').click();
          await test.sleep(10)
          //click delete
          $('e-delete').click();
          
          //check that entry has been deleted
          await test.sleep(10);
          $('#files .active.entry').click();
  
          await test.sleep(10);//wait for GUI update
          
          //Is the entry with the test text still there?
          var text = document.querySelector('#e-body').innerHTML;
          console.log('%c TEST.js: Delete Entry : #e-body value = '+ text, 'color: green; font-style: italic; font-size:10px');
          // if the Text doesn't macth - it should be sucessfully deleted
          if (text != testText && text != undefined ) {
            pass = true;
          }
          return pass;
        }).then((pass) => assert.equal(pass, true));
        
      })
      


      
    })

    
  })

})//Application