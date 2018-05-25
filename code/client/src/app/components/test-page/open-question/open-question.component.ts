import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {QuestionPosition, QuestionAnswer, TypeQuestion, OpenQuestionAnswer, OpenQuestion} from "../../../models";
@Component({
  selector: 'app-test-page-open-question',
  templateUrl: './open-question.component.html',
  styleUrls: ['./open-question.component.css']
})
/*
 component to represent the open question type.
*/
export class TestPageOpenQuestionComponent implements OnInit {
  //the question's data passed as input
  @Input() question: any;//OpenQuestion type
  //the current answer that the subject fills up.
  currentAnswer: string;
  //slider value.
  range_value: number = 50;
  /*
  different options for CSS styles for the location of the question's text and answer.
  */
  positionUp : any;
  positionMiddle : any;
  positionButtom : any;


  // Event emitter to determine if the subject filled an answer
  @Output() answered: EventEmitter<boolean> = new EventEmitter();
  //default constructor.
  constructor() {}

  //default initialization function.
  ngOnInit() {
    this.buildPositionOfQuestion();
    this.answered.emit(false);
  }

  onAnswerChange() {
    if (this.currentAnswer == "") {
      this.answered.emit(false);
    }
    else
      this.answered.emit(true);
  }

  /*
  this function sets the styles for the different positions of the texts and answers
  */
  buildPositionOfQuestion(){
    this.positionUp = {
      'right' : this.isUpperRight(),
      'middle' : this.isUpperMiddle(),
      'left' : this.isUpperLeft()
    }
    this.positionButtom = {
      'right' : this.isButtomRight(),
      'middle' : this.isButtomMiddle(),
      'left' : this.isButtomLeft()
    }
    this.positionMiddle = {
      'right' : this.isMiddleRight(),
      'middle' : this.isMiddleMiddle(),
      'left' : this.isMiddleLeft()
    }
  }


   /*
    ------------------------------- functions for asking the position of the question text -----------------------
  */
  isUpperMiddle(): boolean{
    return this.question.questionPosition == QuestionPosition.UpperMiddle;
  }
  isUpperRight(): boolean{
    return this.question.questionPosition == QuestionPosition.UpperRight;
  }
  isUpperLeft(): boolean{
    return this.question.questionPosition == QuestionPosition.UpperLeft;
  }
  isButtomRight(): boolean{
    return this.question.questionPosition == QuestionPosition.ButtomRight;
  }
  isButtomMiddle(): boolean{
    return this.question.questionPosition == QuestionPosition.ButtomMiddle;
  }
  isButtomLeft(): boolean{
    return this.question.questionPosition == QuestionPosition.ButtomLeft;
  }
  isMiddleRight(): boolean{
    return this.question.questionPosition == QuestionPosition.MiddleRight;
  }
  isMiddleMiddle(): boolean{
    return this.question.questionPosition == QuestionPosition.MiddleMiddle;
  }
  isMiddleLeft(): boolean{
    return this.question.questionPosition == QuestionPosition.MiddleLeft;
  }
  isUp(): boolean{
    return this.isUpperMiddle() || this.isUpperRight() || this.isUpperLeft();
  }
  isMiddle(): boolean{
    return this.isMiddleMiddle() || this.isMiddleRight() || this.isMiddleLeft();
  }
  isButtom():boolean{
    return this.isButtomMiddle() || this.isButtomRight() || this.isButtomLeft();
  }

  buildAnswer(): QuestionAnswer {
    let questionAnswer : OpenQuestionAnswer = {
      questionId: this.question.id,
      subjectId: /* will come later, for now hard-coded */ 1,
      questionType: TypeQuestion.OpenQuestion,
      answer: this.currentAnswer,
      confidence: this.range_value,

    }

    return questionAnswer;
  }
}
