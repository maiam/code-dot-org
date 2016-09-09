import tickWrapper from '../../util/tickWrapper';
import { TestResults } from '@cdo/apps/constants';
import ReactTestUtils from 'react-addons-test-utils';

module.exports = {
  app: "applab",
  skinId: "applab",
  levelFile: "levels",
  levelId: "ec_simple",
  tests: [
    {
      description: "Data Browser shows records and key value pairs",
      editCode: true,
      useFirebase: true,
      xml:`
        createRecord('mytable', {name:'Alice', age:7}, function () {
          console.log('created record');
          setKeyValue('key1', 'value1', function() {
            console.log('created key');
          });
        });`,

      runBeforeClick: function (assert) {
        // add a completion on timeout since this is a freeplay level
        tickWrapper.runOnAppTick(Applab, 200, function () {
          // Overview
          $("#dataModeButton").click();
          const dataOverview = $('#dataOverview');
          assert.equal(dataOverview.is(':visible'), true, 'dataOverview is visible');
          const keyValueLink = dataOverview.find('a:contains(Key/value pairs)');
          const tableLink = dataOverview.find('a:contains(mytable)');
          assert.equal(keyValueLink.is(':visible'), true, 'key/value pairs link is visible');
          assert.equal(tableLink.is(':visible'), true, 'table link is visible');

          // Key/value pairs
          ReactTestUtils.Simulate.click(keyValueLink[0]);
          const dataProperties = $('#dataProperties');
          assert.equal(dataProperties.is(':visible'), true, 'dataProperties is visible');
          const keyValueRow = dataProperties.find('tr:contains(key1)');
          assert.equal(keyValueRow.is(':visible'), true, 'new key appears in the grid');

          // back to Overview
          ReactTestUtils.Simulate.click($('#propertiesBackToOverview')[0]);
          assert.equal(dataOverview.is(':visible'), true, 'dataOverview is visible again');
          assert.equal(keyValueLink.is(':visible'), true, 'key/value pairs link is visible again');
          assert.equal(tableLink.is(':visible'), true, 'table link is visible again');
          ReactTestUtils.Simulate.click(tableLink[0]);

          // Table
          const dataTable = $('#dataTable');
          assert.equal(dataTable.is(':visible'), true, 'dataTable is visible');
          const recordRow = dataTable.find('tr:contains(Alice)');
          assert.equal(recordRow.is(':visible'), true, 'new record appears in the grid');

          Applab.onPuzzleComplete();
        });
      },
      customValidator: function (assert) {
        // No errors in output console
        var debugOutput = document.getElementById('debug-output');
        assert.equal(debugOutput.textContent, 'created record\ncreated key');
        return true;
      },
      expected: {
        result: true,
        testResult: TestResults.FREE_PLAY
      },
    },

    {
      description: "Data Browser can add tables, columns and rows",
      editCode: true,
      useFirebase: true,

      runBeforeClick: function (assert) {
        // add a completion on timeout since this is a freeplay level
        tickWrapper.runOnAppTick(Applab, 2, function () {
          // Overview
          $("#dataModeButton").click();
          const dataOverview = $('#dataOverview');
          assert.equal(dataOverview.is(':visible'), true, 'dataOverview is visible');
          let tableLink = dataOverview.find('a:contains(mytable)');
          assert.equal(tableLink.length, 0, 'mytable link does not exist yet');

          // Create a new table from the overview
          const newTableInput = dataOverview.find('input');
          ReactTestUtils.Simulate.change(newTableInput[0],
            { target: { value: 'mytable' } });
          const addTableButton = dataOverview.find('button:contains(Add)');
          ReactTestUtils.Simulate.click(addTableButton[0]);
          setTimeout(() => {
            const dataTable = $('#dataTable');
            assert.equal(dataTable.is(':visible'), true, 'dataTable is visible');

            // rename initial column
            const column1NameInput = dataTable.find('th > input[value="column1"]');
            assert.equal(column1NameInput.is(':visible'), true, 'column1 name input is visible');
            ReactTestUtils.Simulate.change(column1NameInput[0], { target: { value: 'firstname' } });
            const enterKeyEvent = {key: "Enter", keyCode: 13, which: 13};
            ReactTestUtils.Simulate.keyUp(column1NameInput[0], enterKeyEvent);
            assert.equal(column1NameInput.is(':visible'), false, 'column1 name input is hidden');
            assert.equal(dataTable.find('th > div:contains(firstname)').is(':visible'), true, 'column1 renamed to firstname');

            // add new column
            ReactTestUtils.Simulate.click($('#addColumnButton')[0]);
            setTimeout(() => {
              const column2NameInput = dataTable.find('th > input[value="column2"]');
              assert.equal(column2NameInput.is(':visible'), true, 'column2 name input is visible');
              ReactTestUtils.Simulate.change(column2NameInput[0], { target: { value: 'age' } });
              ReactTestUtils.Simulate.keyUp(column2NameInput[0], enterKeyEvent);
              assert.equal(dataTable.find('th > div:contains(age)').is(':visible'), true, 'column1 renamed to age');

              // add new row
              const addRow = $('#dataTable').find('tr:contains(Add Row)');
              ReactTestUtils.Simulate.change(addRow.find('input')[0], { target: { value: 'bob' } });
              ReactTestUtils.Simulate.change(addRow.find('input')[1], { target: { value: '8' } });
              ReactTestUtils.Simulate.keyUp(addRow.find('input')[1], enterKeyEvent);
              setTimeout(() => {
                const dataRow1 = $('#dataTable').find('tr:contains(Edit)');
                assert.equal(dataRow1.find('td')[0].innerHTML, '1', 'id cell value');
                assert.equal(dataRow1.find('td')[1].innerHTML, '"bob"', 'firstname cell value');
                assert.equal(dataRow1.find('td')[2].innerHTML, '8', 'age cell value');

                // add another row
                ReactTestUtils.Simulate.change(addRow.find('input')[0], { target: { value: 'charlie' } });
                ReactTestUtils.Simulate.change(addRow.find('input')[1], { target: { value: '9' } });
                ReactTestUtils.Simulate.keyUp(addRow.find('input')[1], enterKeyEvent);
                setTimeout(() => {
                  const dataRow2 = $('#dataTable').find('tr:contains(Edit)');
                  assert.equal(dataRow2.find('td')[0].innerHTML, '1', 'id cell value');
                  assert.equal(dataRow2.find('td')[1].innerHTML, '"bob"', 'firstname cell value');
                  assert.equal(dataRow2.find('td')[2].innerHTML, '8', 'age cell value');

                  Applab.onPuzzleComplete();
                }, 100);
              }, 100);
            }, 100);
          }, 100);
        });
      },
      customValidator: function (assert) {
        // No errors in output console
        var debugOutput = document.getElementById('debug-output');
        assert.equal(debugOutput.textContent, '');
        return true;
      },
      expected: {
        result: true,
        testResult: TestResults.FREE_PLAY
      },
    },

    {
      description: "Data Browser can edit table rows",
      editCode: true,
      useFirebase: true,
      xml:`
        createRecord('mytable', {name:'Alice', age:7, male:false}, function () {
          console.log('created record 1');
          createRecord('mytable', {name:'Bob', age:8, male:true}, function () {
            console.log('created record 2');
          });
        });`,

      runBeforeClick: function (assert) {
        // add a completion on timeout since this is a freeplay level
        tickWrapper.runOnAppTick(Applab, 200, function () {
          // Overview
          $("#dataModeButton").click();
          const dataOverview = $('#dataOverview');
          assert.equal(dataOverview.is(':visible'), true, 'dataOverview is visible');
          const tableLink = dataOverview.find('a:contains(mytable)');
          assert.equal(tableLink.is(':visible'), true, 'table link is visible');

          // view table
          ReactTestUtils.Simulate.click(tableLink[0]);
          const dataTable = $('#dataTable');
          assert.equal(dataTable.is(':visible'), true, 'dataTable is visible');
          const record1Row = dataTable.find('tr:contains(Alice)');
          assert.equal(record1Row.is(':visible'), true, 'record 1 appears in the grid');
          const record2Row = dataTable.find('tr:contains(Bob)');
          assert.equal(record2Row.is(':visible'), true, 'record 2 appears in the grid');

          // edit row
          let editButton = record1Row.find('button:contains(Edit)');
          assert.equal(editButton.is(':visible'), true, 'edit row button visible');
          ReactTestUtils.Simulate.click(editButton[0]);
          const saveButton = record1Row.find('button:contains(Save)');
          editButton = record1Row.find('button:contains(Edit)');
          assert.equal(editButton.is(':visible'), false, 'edit row button hidden');
          assert.equal(saveButton.is(':visible'), true, 'save row button visible');
          const ageInput = record1Row.find('input')[1];
          assert.equal(ageInput.value, '7', 'age input cell value in edit row');
          ReactTestUtils.Simulate.change(ageInput, { target: { value: '9' } });
          const enterKeyEvent = {key: "Enter", keyCode: 13, which: 13};
          ReactTestUtils.Simulate.keyUp(ageInput, enterKeyEvent);
          setTimeout(() => {
            editButton = record1Row.find('button:contains(Edit)');
            assert.equal(editButton.is(':visible'), true, 'edit row button visible');
            const ageCell = record1Row.find('td')[2];
            assert.equal(ageCell.innerHTML, '9', 'age cell saved value');

            Applab.onPuzzleComplete();
          }, 100);
        });
      },
      customValidator: function (assert) {
        // No errors in output console
        var debugOutput = document.getElementById('debug-output');
        assert.equal(debugOutput.textContent, 'created record 1\ncreated record 2');
        return true;
      },
      expected: {
        result: true,
        testResult: TestResults.FREE_PLAY
      },
    },


    // The data browser uses Firebase.off() somewhat broadly in order to stop
    // listening for data changes as you switch between data browser views. This
    // could potentially interfere with the listeners used by the onRecordEvent
    // block. This test ensures that the onRecordEvent block works properly even
    // as the data browser switches views.
    {
      description: "Data Browser doesn't interfere with onRecordEvent",
      editCode: true,
      useFirebase: true,
      xml:`
        button("createRecord", "Create");
        onEvent("createRecord", "click", function(event) {
          createRecord("mytable", {name: 'Alice'});
        });
        onRecordEvent('mytable', function(record, eventType) {
          if (eventType === 'create') {
            console.log('created record ' + record.id);
          } 
        });`,

      runBeforeClick: function (assert) {
        // add a completion on timeout since this is a freeplay level
        tickWrapper.runOnAppTick(Applab, 2, function () {
          const debugOutput = document.getElementById('debug-output');

          // Data mode overview
          $("#dataModeButton").click();
          const dataOverview = $('#dataOverview');
          assert.equal(dataOverview.is(':visible'), true, 'dataOverview is initially visible');
          let tableLink = dataOverview.find('a:contains(mytable)');
          assert.equal(tableLink.length, 0, 'mytable link does not initially exist');
          assert.equal(debugOutput.textContent, '');

          // create record 1
          $('#createRecord').click();
          setTimeout(() => {
            tableLink = dataOverview.find('a:contains(mytable)');
            assert.equal(tableLink.is(':visible'), true, 'table link exists');
            assert.equal(debugOutput.textContent, 'created record 1'); //
            ReactTestUtils.Simulate.click(tableLink[0]);

            // view mytable
            const dataTable = $('#dataTable');
            assert.equal(dataTable.is(':visible'), true, 'dataTable is visible');
            let recordRow = dataTable.find('tr:contains(Alice)');
            assert.equal(recordRow.length, 1, 'one table row exists in mytable');

            // back to overview
            ReactTestUtils.Simulate.click($('#tableBackToOverview')[0]);
            const newTableInput = dataOverview.find('input');
            ReactTestUtils.Simulate.change(newTableInput[0],
              { target: { value: 'other table' } });
            const addTableButton = dataOverview.find('button:contains(Add)');

            // view other table
            ReactTestUtils.Simulate.click(addTableButton[0]);
            setTimeout(() => {
              assert.equal(dataTable.is(':visible'), true, 'other table is visible');
              recordRow = dataTable.find('tr:contains(Alice)');
              assert.equal(recordRow.length, 0, 'no table rows in other table');

              // create record 2
              $('#createRecord').click();
              setTimeout(() => {
                recordRow = dataTable.find('tr:contains(Alice)');
                assert.equal(recordRow.length, 0, 'still no table rows in other table');
                assert.equal(debugOutput.textContent, 'created record 1\ncreated record 2');

                // back to overview
                ReactTestUtils.Simulate.click($('#tableBackToOverview')[0]);

                // view mytable
                ReactTestUtils.Simulate.click(tableLink[0]);
                recordRow = dataTable.find('tr:contains(Alice)');
                assert.equal(recordRow.length, 2, 'two table rows in mytable');
                assert.equal(debugOutput.textContent, 'created record 1\ncreated record 2');

                // create record 3
                $('#createRecord').click();
                setTimeout(() => {
                  recordRow = dataTable.find('tr:contains(Alice)');
                  assert.equal(recordRow.length, 3, 'three table rows in mytable');
                  assert.equal(debugOutput.textContent,
                    'created record 1\ncreated record 2\ncreated record 3');

                  Applab.onPuzzleComplete();
                }, 100);
              }, 100);
            }, 100);
          }, 100);
        });
      },
      customValidator: function (assert) {
        // No errors in output console
        var debugOutput = document.getElementById('debug-output');
        assert.equal(debugOutput.textContent,
          'created record 1\ncreated record 2\ncreated record 3');
        return true;
      },
      expected: {
        result: true,
        testResult: TestResults.FREE_PLAY
      },
    },
  ]
};
