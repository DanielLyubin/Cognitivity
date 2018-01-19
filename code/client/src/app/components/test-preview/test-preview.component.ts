import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { LocalStorageService } from '../../services/local-storage';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Test, Question, OpenQuestion, TypeQuestion, QuestionPosition, Block } from '../../models';

@Component({
  selector: 'app-test-preview',
  templateUrl: './test-preview.component.html',
  styleUrls: ['./test-preview.component.css']
})

/*
this component takes place when the preview button is fired (to preview the whole test)
it uses the block viewer and indirectly the question viewer to view the whole test.
*/
export class TestPreviewComponent implements OnInit {
  
  //default constructor 
  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  //the test object , so we can save/import tests.
  test: Test;
  //the current test id.
  testId: number;
  //the current test's index in the tests list.
  currIndex: number;
  //variable to indicate if we should hide the following button in the creation.
  hideNextButton: boolean = true;

  //default initialization function.
  ngOnInit() {
    var question: OpenQuestion = {
      questionText: 'hello friend?',
      type: TypeQuestion.OpenQuestion,
      answerText: 'hello',
      questionPosition: QuestionPosition.ButtomLeft
    }

    var question2: OpenQuestion = {
      questionText: 'what\'s new with you?',
      type: TypeQuestion.OpenQuestion,
      answerText: 'nothin\' much',
      questionPosition: QuestionPosition.UpperMiddle
    }

    var question3: OpenQuestion = {
      questionText: 'hihihihi?',
      type: TypeQuestion.OpenQuestion,
      answerText: 'nothin\' much',
      questionPosition: QuestionPosition.UpperMiddle
    }

    var question5: OpenQuestion = {
      questionText: 'hih?',
      type: TypeQuestion.OpenQuestion,
      answerText: 'nothin\' much',
      questionPosition: QuestionPosition.UpperMiddle
    }

    var block : Block = {
      questions: [question, question2]
    }

    var block2: Block = {
      questions: [question3]
    }

    var block3: Block = {
      questions: [question5]
    }
    this.testId = this.route.snapshot.params['testId'];
    this.test = this.localStorageService.get('test'+this.testId);
    this.test = {
      blocks: [block,block2,block3]
    }
    this.currIndex = 0;
  }

  /*
  Input - an index of a specific block
  Output - returns a boolean result if the called block's id (from the HTML form) is the current id 
  were viewing. 
  */
  showBlock(index) {
    return index == this.currIndex;
  }

  /*
  to indicate if we finished previewing the test.
  */
  isFinished(e) {
    this.hideNextButton = !e;
  }

  //routing back to the dashboard after we finished previewing the test.
  finishPreview() {
    this.router.navigate(['/dashboard']);
  }

  /*
  this function increments our block index (the index of the block were viewing)
  and checks if we finished (reached the last object in the blocks list)
  */
  nextBlock() {
    this.currIndex++;
    this.hideNextButton = true;
    if (this.currIndex == this.test.blocks.length) {
      this.finishPreview();
    }
  }

}
