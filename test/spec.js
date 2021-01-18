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
    //each CRUD test assumes that the last entry created is at the top of the list as the active element
    //tests will fail if this is not the case
    describe('CREATE', function () {

      it('creates an entry', function () {
        
        return this.app.client.execute(async function () {
          var pass = false;
          // check number of entries
          var count1 = document.querySelector('#files').children.length;
          
          console.log('%c TEST.js: Create Entry : #e-body value : var count1 = '+ count1, 'color: green; font-style: italic; font-size:10px');
          
          // click create 
          $('#e-create').click();
          await test.sleep(10)
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

            if ( ++count1 == count2) {
              pass = true;
            }
            else {
              console.error('CREATE: count1=',count1,'count2=',count2);
            }
            return pass;
          }
          //TODO - Try to implement an better ansynchronous testing
          // test.createEntryResponse(() => {return checkCount()});
         pass = await test.sleep(300).then(() => {return checkCount();});

          return pass;
        }).then((pass) => assert.equal(pass, true))
        
      })//end of function (){})
     

    })//Describe Create Ends

    describe('READ', function () {
      it('reads active entry', function () {
        return this.app.client.execute( async function () {
          var pass = false;

          //click on active entry
          $('#files .active.entry').click();

          await test.sleep(10);
            
          //entry body should contant test of CREATE test
          var text = document.querySelector('#e-body').innerHTML;
          
          console.log('%c TEST.js: Read Entry : #e-body value : var text = '+ text, 'color: green; font-style: italic; font-size:10px');

          if (text != null) {
            pass = true;
          }
          return pass;

        })
      })
      it('reads last entry saved (i.e.check that last entry is active entry)', function () {
        return this.app.client.execute(async function() {
          var testText = "Last Entry";
          var pass = false;


          //create and entry
          $('#e-create').click();
          await test.sleep(10);
          // enter text input form field into fields
          document.querySelector('#new-entry-body').value = testText;

          await test.sleep(10);
          // click submit 
          $('#btn-submit').click();

          await test.sleep(30);

          //click on active entry
          $('#files .active.entry').click();

          await test.sleep(10);
            
          //entry body should contant test of CREATE test
          var text = document.querySelector('#e-body').innerHTML;
          
          console.log('%c TEST.js: Read Entry : #e-body value : var text = '+ text, 'color: green; font-style: italic; font-size:10px');

          if (text == '<pre>'+testText+'</pre>') {
            pass = true;
          }
          else {
            console.error('READ: last entry: text=',text);
          }
          return pass;
          
        }).then((pass) => assert.equal(pass,true));
      })
    })

    describe('UPDATE', function () {

      it('updates active entry', function () {
        return this.app.client.execute( async function () {
          var pass = false;
          var read = '#e-body';
          var write = '#new-entry-body';

          //click active entry 
          $('#files .active.entry').click();
          await test.sleep(5);// GUI - wait for file.log to be retrieved
          
          // check text - read
          var text =  document.querySelector(read).innerHTML;
          console.log('%c TEST.js: Update Entry : #e-body value : var text = '+ text, 'color: green; font-style: italic; font-size:10px');

          // click update
          $('#e-update').click();
          await test.sleep(5); //GUI - wait for.log update

          // enter change - write 
          var updatedText = " Update to the entry test.";
          document.querySelector(write).value = updatedText;
          console.log('%c TEST.js: Update Entry : #e-body value set to : var updateText = '+ updatedText, 'color: green; font-style: italic; font-size:10px');

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
          } else {
            console.error('text2 did not match updatedText- text2=', text2);
          }
          return pass;
        }).then((pass => assert.equal(pass, true))); 
      })
    })

    describe('DELETE', function () {
      it ('deletes active entry', function () {
        return this.app.client.execute(async function() {
          var pass = false;
          var count1 = document.querySelector('#files').children.length;
          var testText = "DELETE an entry test";

          /******** Mock User Action Sequence: DELETE  */
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
          $('#e-delete').click();
          /*********************************** */

          await test.sleep(5);
          var count2 = document.querySelector('#files').children.length;

          if (count1 > count2) {
            pass = true;
          }
          else {
            console.error('DELETE : count1=',count1,'count2=',count2);
          }
          return pass;
        }).then((pass) => assert.equal(pass,true))
      })
        
      it('deletes last entry', function () {

        return this.app.client.execute( async function () {
          var pass = false;
          var testText1 = "DELETE last entry test";
          var testText2 = "SHOULD BE DELETED";

          /******** Mock User Action Sequence: CREATE 2, DELETE 1  */

          /**CREATE 2 Entries */
          //create and entry
          $('#e-create').click();
          await test.sleep(10);
          // enter text input form field into fields
          document.querySelector('#new-entry-body').value = testText1;
          // click submit 
          $('#btn-submit').click();

          await test.sleep(20);
          //create and entry
          $('#e-create').click();
          await test.sleep(10);
          // enter text input form field into fields
          document.querySelector('#new-entry-body').value = testText2;
          // click submit 
          $('#btn-submit').click();
          
          await test.sleep(15)//wait for entry to be submitted and gui to update
        
          /** DELETE 1 Entry */
          // click active entry
          $('#files .active.entry').click();
          await test.sleep(10)
          //click delete
          $('#e-delete').click();
          /*********************************** */

          /**** Test Whether Delete is Succesful */
          //check that entry has been deleted
          await test.sleep(10);
          $('#files .active.entry').click();
  
          await test.sleep(10);//wait for GUI update
          
          //Is the entry with the test text still there?
          var text = document.querySelector('#e-body').innerHTML;
          console.log('%c TEST.js: Delete Entry : #e-body value = '+ text, 'color: green; font-style: italic; font-size:10px');
          // if the Text doesn't macth - it should be sucessfully deleted
          if (text == testText1 || text == undefined ) {
            pass = true;
          }
          else {
            console.error('DELETE: last entry: text=',text, 'testText2=',testText2);
          }
          return pass;
        }).then((pass) => assert.equal(pass, true));
        
      })
      
      
    })//describe Entry CRUD

    
  }) //described View

})//Application