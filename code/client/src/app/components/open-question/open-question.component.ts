import {Component, Input, OnInit} from "@angular/core";
import {QuestionPosition} from "../../models";
@Component({
  selector: 'app-open-question',
  templateUrl: './open-question.component.html',
  styleUrls: ['./open-question.component.css']
})
/*
 component to represent the open question type.
*/
export class OpenQuestionComponent implements OnInit {
  //the question's data passed as input
  @Input() question: any;
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

  //to indicate if we need to show the confidence bar
  isAnswered:boolean;

  //to indicate if one can edit the text answer.
  isEdit:boolean;

  //default constructor.
  constructor() {}

  //default initialization function.
  ngOnInit() {
    this.buildPositionOfQuestion();
    this.isAnswered = false;
    this.isEdit = true;
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

/**
 * This function will set the isAnswered property to True
 */
submit_answer(){
  this.isAnswered = true;
  this.isEdit = false;
}

//can also add future add-ons like distractions when changing an answer.
change_answer(){
  this.isAnswered = false;
  this.isEdit = true;
}
//return confidence bar need
get_is_answered():boolean{
  return this.isAnswered;
}

//return isEdit 
is_edit_mode():boolean{
  return this.isEdit;
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
}
