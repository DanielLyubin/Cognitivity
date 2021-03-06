import { Component, OnInit, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Block, Test, QuestionInDB, Manager } from '../../models/index';
import { BlockComponent } from '../block/block.component';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session-service/index';
import { TestService, TestManagerService, FileUploadService } from '../../services/database-service/index';
import { AuthService } from '../../services/auth-service/index';
import { QueryList, ViewChildren  } from '@angular/core';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.css'],
  host: {
    '(document:keydown)' : 'onPress($event)'
  }
})

/*
this main component is responsible to show the whole page of the test creation.
including the block creation and sub question creation.
*/
export class CreateTestComponent implements OnInit {
  //this component helps us to get variables from the sub objects.
  @ViewChildren(BlockComponent) blocks: QueryList<BlockComponent>;

  //loaded flag
  loaded_tests: boolean = false;
  loaded_blocks : boolean = false;

  savingTest: boolean = false;

  //the actual list of the blocks.
  blocksList = []
  //object of a test , so we can save and import tests.
  test: Test;
  //for iterating over the blocks. we want to keep a question related to it's current block object.
  iterator: Array<any> = new Array();
  //the string to be shown on the test title.
  titleTest: string;
  //The manager of the soon to be created test;
  manager: Manager = {id: -1, email: ''};

  emptyBlock: boolean = false;

  emptyTest: boolean = false;

  noTitle: boolean = false;

  indexBlock: number = -1;

  // in case of upload file
  file : File = null;

  projectname:string;
  notes: string;
  chosen_file : boolean = false;
  @ViewChild('inputFile') myInputFile : any;
  /*
   * Information for importing block Author: Mark, Date: 11.6.18
   */
  testList: Test[];// The list of all the test to choose from
  testBlockList: Block[];//
  chosenBlock: Block;
  testNameToImport: string = '';
  blockPreview: boolean = false;
  finished = false;
  //default constructor
  constructor(
    private router:Router,
    private route: ActivatedRoute,
    public questionDataService:SessionService,
    private testService: TestService,
    private authService: AuthService,
    private managerService: TestManagerService,
    private fileUploadService: FileUploadService
  ) {}

  /*
  async is used for syncing the rec and send of the objects.
  the rest of the init takes care of recieving the sent data.
  */
  async ngOnInit() {
    let user = this.authService.getCurrentManagerEmail();
    let managerId = await this.managerService.getManagerId(user);
    this.manager.email = user;
    this.manager.id = managerId;
    this.notes = "";
    try {
      this.loaded_tests = true;
      this.testList = await this.testService.findTestsForTestManager(managerId);
      this.loaded_tests = false;

    } catch(err) {
      console.log(err);
    }
  }

  //this function adds a block to out list using the iterator.
  addBlock(){
    let inputBlock = {block: null};
    this.iterator.splice(this.iterator.length, 0, inputBlock);
  }

  /*
  Input - the current index of the block to move up.
  Output - the block is moved up in the list.
  */
  moveMeUp(currentIndex: number) {
    if(currentIndex != 0){
      let removed = this.iterator.splice(currentIndex, 1);
      this.iterator.splice(currentIndex - 1, 0, removed[0]);
    }
  }

  /*
  Input - the current index of the block to move down.
  Output - the block is moved down in the list.
  */
  moveMeDown(currentIndex: number) {
    if(currentIndex != this.blocksList.length-1){
      let removed = this.iterator.splice(currentIndex, 1);
      this.iterator.splice(currentIndex + 1, 0, removed[0]);
    }
  }

  /*
  getter for the list of questions.
  */
  getQuestions(index: number){
    this.blocksList = this.blocks.toArray();
  }

  /*
  Input - the index of the block to be deleted.
  Output - the block is removed from the list.
  */
  deleteBlock(index: number){
    this.iterator.splice(index,1);
  }

  regex = /[\ ]*([A-Za-z0-9)(]+[\ ]*)+/;


  /*
   * validates the test name before saving it to database
   * @parameter testName: the name that need to be validated
   */
  async testNameValidate(testName : string){
      let badName = 'A bad name. Please choose a name with only letters and numbers';
      let nameAlreadyTaken = 'Name already taken!';
      if (testName == null || testName == '' || !this.regex.test(testName)) {
        alert(badName);
        return false;
      }
      let arr = this.regex.exec(testName);
      if (arr[0] != testName) {
        alert(badName);
        return false;
      }
      // in case the asyncronical request didn't finished
      if(!this.loaded_tests){
          let interval = setInterval(() => {
              if(this.loaded_tests) clearInterval(interval);
          }, 1000);
      }
      for (let test of this.testList) {
        if (test.name.trim() == testName.trim().replace(/\s\s+/g, ' ')) {
          alert(nameAlreadyTaken);
          return false;
        }
      }
      return true;
  }

  /**
   * This function saves a test in the DB.
   * It iterates over all of the questions of all of the blocks
   * and collects them to a test object
   */
  async saveTest() {
    if (this.titleTest == '' || this.titleTest == null) {
      this.noTitle = true;
      return;
    } else {
      this.noTitle = false;
    }
    let blocks = this.blocks.toArray();
    if (blocks.length == 0) {
      this.emptyTest = true;
      return;
    } else {
      this.emptyTest = false;
    }
    for(let i = 0; i < blocks.length; i++){
      if(blocks[i].getQuestions().length == 0){
        this.emptyBlock = true;
        this.indexBlock = i + 1;
        return;
      } else {
        this.emptyBlock = false;
      }
    }
    let badName = 'A bad name. Please choose a name with only letters and numbers';
      let nameAlreadyTaken = 'Name already taken!';
      if (this.titleTest == null || this.titleTest == '' || !this.regex.test(this.titleTest)) {
        alert(badName);
        return false;
      }
      let arr = this.regex.exec(this.titleTest);
      if (arr[0] != this.titleTest) {
        alert(badName);
        return;
      }
      if(!this.loaded_tests){
          let interval = setInterval(() => {
              if(this.loaded_tests) clearInterval(interval);
          }, 1000);
      }
      for (let test of this.testList) {
        if (test.name.trim() == this.titleTest.trim().replace(/\s\s+/g, ' ')) {
          alert(nameAlreadyTaken);
          return;
        }
      }

    let blocksToDB: Block[] = [];
    let totalQuestionNum: number = 0;
    for (let block of blocks) {

      let questions: QuestionInDB[] = [];

      for (let questionInBlock of block.getQuestions()) {
        let questionInDB: QuestionInDB =
        {
          question: JSON.stringify(questionInBlock.question),
          questionPosition: questionInBlock.question.questionPosition,
          type: questionInBlock.question.type,
          pictureLink: questionInBlock.pictureLink
        }

        questions.push(questionInDB);
      }

      totalQuestionNum += questions.length;

      let blockInDB: Block =
      {
        questions: questions,
        numberOfQuestions: questions.length,
        tag: JSON.stringify(block.getTags()),
        randomize: block.randomize

      }

      blocksToDB.push(blockInDB);
    }

    let date = Date.parse(new Date().toLocaleDateString());
    let test: Test =
    {
      name: this.titleTest,
      notes: this.notes,
      project:this.projectname,
      blocks: blocksToDB,
      state: 0,
      numberOfQuestions: totalQuestionNum,
      numberOfFiledCopies: 0,
      numberOfSubjects: 0,
      testManager: this.manager
    }
    this.savingTest = true;
    await this.testService.saveCognitiveTest(test);
    this.router.navigate(['/dashboard']);

  }

  updateFile(event){
      if (event.target.files == null || event.target.files.length == 0){
        this.chosen_file = false;
        return;
      }
      if(event.target.files.length != 1){
        this.chosen_file = false;
          alert("only one file can be submitted each time");
          return;
      }
      this.chosen_file = true;
      let fullFile = event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event) => {
          try {
            		this.file = reader.result; // JSON.parse(reader.result);
          } catch (ex) {
    			alert('exception when trying to parse json = ' + ex);
		  }
      };
      reader.readAsText(fullFile);
  }

  async uploadTest() {
    if(!this.file) {
      alert('Bad file! Exiting...');
      return;
    }
    this.savingTest = true;
    await this.fileUploadService.uploadCognitiveTest(this.file, this.manager.id);
    this.router.navigate(['/dashboard']);
  }

  onPress(event: KeyboardEvent) {
    if (event.key == 'F5') {
      if (confirm('Do you want to refresh or go back? All progress will be lost!!')) {
        return true;
      } else {
        return false;
      }
    }
  }


  async clickTest(index: number){
      let testId = this.testList[index].id;
      this.loaded_blocks = true;
      let test = await this.testService.findCognitiveTestById(testId);
      this.loaded_blocks = false;
      this.testBlockList = test.blocks;
      this.testNameToImport = test.name;
  }
  addImportedBlock(index: number){
    this.testNameToImport = '';
    let blockToAdd = this.testBlockList[index];
    let inputBlock = {block: blockToAdd};
    this.iterator.splice(this.iterator.length, 0, inputBlock);
    //this.blocksList.splice(this.blocksList.length, this.testBlockList[index])
  }
  previewBlock(index: number){
    this.blockPreview = true;
    let blockToAdd = this.testBlockList[index];
    this.chosenBlock = blockToAdd;
  }
  isFinished(e) {
    this.finished = e;
    if(this.finished){
      this.blockPreview = false;
    }
  }

  prettifyTagList(block, index){
      if(block.tag == '[]'){
        return 'Block no. ' + index + ' doesn\'t have tags';
      }
      let tags = JSON.parse(block.tag);
      tags = tags.map(item => item.value);
      return tags.join(", ");
  }

  uploadTestFile(){
    this.chosen_file = false;
    this.myInputFile.nativeElement.value = "";
  }

}
