import {Component, Input, OnInit} from "@angular/core";
import {QuestionPosition, TypeMultipleQuestion} from "../../models";
@Component({
  selector: 'app-multiple-choice-question',
  templateUrl: './multiple-choice-question.component.html',
  styleUrls: ['./multiple-choice-question.component.css']
})

/*
component for a multiple choice question.
*/
export class MultipleChoiceQuestionComponent implements OnInit {
  //input of the question's data.
  @Input() question: any;
  //array to indicate what answers are highlighted.
  markedAnswers?: Array<boolean>;
  //Objects that detemines the style of the question text itself
  positionUp: any;
  positionMiddle: any;
  positionButtom: any;

  //number of questions that currently marked, so we can view the confidence bar
  answeredQuestions:number;

  //slider value
  range_value: number = 50;
  //the chosen organization of the question's answers
  answerOrganization: TypeMultipleQuestion;
  /*
   ---------------------- special objects that are ment for multiple question of type matrix
  */
  markedAnswersMatrix?: Array<Array<boolean>>;
  dimMatrix?: number;
  matrixAnswers?: Array<Array<string>>;
  //An object that centers the matrix in the web page acocording its size
  centeringMatrix?: any;

  //default constructor.
  constructor(){}

  //default initialization function.
  ngOnInit() {
    this.answerOrganization = this.question.typeMultipleQuestion;
    this.constructMarking();
    this.buildPositionOfQuestion();
    if(this.answerOrganization == TypeMultipleQuestion.Matrix){
      this.constructMatrix();
    }
    
    this.answeredQuestions = 0;
  }

  /*
  This function builds up the matrix.
   we need to matrix to use the different locations of the question and
  the question's answers on the screen.
  */
  constructMatrix(){
    this.matrixAnswers = new Array<Array<string>>(this.dimMatrix);
    for(let i = 0; i < this.dimMatrix; i++){
      this.matrixAnswers[i] = new Array<string>(this.dimMatrix);
      for(let j = 0; j < this.dimMatrix; j++){
        this.matrixAnswers[i][j] = this.question.answers[j*this.dimMatrix + i];
      }
    }
    this.centeringMatrix = {
      'one_col' : this.isOneCol(),
      'two_col' : this.isTwoCol(),
      'three_col' : this.isThreeCol(),
      'four_col' : this.isFourCol(),
      'higherThanFour' : this.higherThanFourColNum()
    }
  }

  /*
    preparing the marking objects that will bind to the check boxes at the GUI.
  */
  constructMarking(){
    if(this.answerOrganization == TypeMultipleQuestion.Matrix){
      this.dimMatrix = Math.sqrt(this.question.answers.length);
      this.markedAnswersMatrix = new Array<Array<boolean>>(this.dimMatrix);
      for(let i = 0; i < this.dimMatrix; i++){
        this.markedAnswersMatrix[i] = new Array<boolean>(this.dimMatrix);
        for(let j = 0; j < this.dimMatrix; j++){
          this.markedAnswersMatrix[i][j] = false;
        }
      }
    }else{
      let answersSize: number = this.question.answers.length;
      this.markedAnswers = new Array<boolean>(answersSize);
      for(let i = 0; i < answersSize; i++){
        this.markedAnswers[i] = false;
      }
    }

  }

  /*
    chosing the right style according to the position that was chosen
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
   A function that marks the answer that the user marked. In case the type of the question is Horizontal or vartical the secondary index isn't needed.
    The index specify which answer was marked. Due to the binding of this property it will affect the GUI.
  */
  markAnswer(main_index: number,secondary_index:number = -1){
    if(secondary_index == -1){
      for(let i = 0; i < this.question.answers.length; i++){
        if(i == main_index){
          this.markedAnswers[i] = !this.markedAnswers[i];
          // if we marked another question, we would like the add 1 to the marked questions, else we should remove one
          this.answeredQuestions += this.markedAnswers[i] ? 1 : -1;
        }
      }
    }else{
      for(let i = 0; i < this.dimMatrix; i++){
        for(let j = 0; j < this.dimMatrix; j++){
          if(i == main_index && j == secondary_index){
            this.markedAnswersMatrix[i][j] = !this.markedAnswersMatrix[i][j];
            this.answeredQuestions += this.markedAnswersMatrix[i][j] ? 1 : -1;
          }
        }
      }
    }
  }

  /*
   ------------- Asking the type of the multiple question ------------------
  */
  isVertical(): boolean{
    return this.answerOrganization == TypeMultipleQuestion.Vertical;
  }
  isHorizontal(): boolean{
    return this.answerOrganization == TypeMultipleQuestion.Horizontal;
  }

  isMatrix(): boolean {
    return this.answerOrganization == TypeMultipleQuestion.Matrix;
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

  /*
    -------- functions that helps centering the matrix depending on the number of columns
  */
  isOneCol():boolean {
    return this.dimMatrix == 1;
  }
  isTwoCol():boolean{
    return this.dimMatrix == 2;
  }
  isThreeCol():boolean{
    return this.dimMatrix == 3;
  }
  isFourCol():boolean{
    return this.dimMatrix == 4;
  }
  higherThanFourColNum():boolean{
    return this.dimMatrix > 4;
  }

  //this function will return the if there any question marked to indicate if we need to show the confidence bar
  get_is_answered():boolean{
    return this.answeredQuestions > 0;
  }

  /*
   *
   * A function that returns the answer of the subject
   */
  returnAnswers(){
    let answerIndex = -1;
    if(this.answerOrganization == TypeMultipleQuestion.Matrix){
      for(let i = 0; i < this.dimMatrix; i++){
        for(let j = 0; j < this.dimMatrix; j++){
          if(this.markedAnswersMatrix[i][j]){
            answerIndex = j*this.dimMatrix + i;
          }

        }
      }
    }else{
      for(let i = 0; i < this.dimMatrix; i++){
        if(this.markedAnswers[i]){
          answerIndex = i;
        }
      }
    }
    return answerIndex;
  }
}
