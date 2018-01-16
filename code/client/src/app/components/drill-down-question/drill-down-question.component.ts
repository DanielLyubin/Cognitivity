import { Component, OnInit } from '@angular/core';
import { DrillDownQuestion, TypeQuestion, QuestionPosition } from '../../models';
@Component({
  selector: 'app-drill-down-question',
  templateUrl: './drill-down-question.component.html',
  styleUrls: ['./drill-down-question.component.css']
})
export class DrillDownQuestionComponent implements OnInit {
  question: DrillDownQuestion;
  markedAnswersMain: Array<boolean>;
  markedAnswerMain: string = 'Choose an answer';
  markedAnswerSecondery: string = 'Choose an answer';
  markedAnswersSecondary: Array<boolean>;
  secondaryQuestion: string;
  currentSecondaryAnswers: Array<string>;
  range_value: number = 50;
  secondaryQuestionMode: boolean = false;
  constructor() { }

  ngOnInit() {
    this.question = {
      questionText: 'Who was the first president of the United States of America?',
      type: TypeQuestion.DrillDownQuestion,
      answersForMain: [
        'George Bush',
        'Donald Trump',
        'Bill Clinton',
        'Hillary Clinton',
        'None of the above'
      ],
      correctMainQuestion: 4,
      secondaryQuestionsText: [
        null,
        'Does Donald Trump a president now?',
        'What is the color of the hair of Bill Clinton?',
        'In What year hillary Clinton lost to Donal Trump?',
        null
      ],
      answersForSecondary: [
        null,
        ['Yes', 'No'],
        ['Grey', 'Brown', 'Blue', 'Yellow', 'Red', 'He doesnt have hair'],
        ['2014', '1990', '2012', '2017'],
        null
      ],
      correctAnswerSecondary: [
        0,
        1,
        3
      ]

    };
    this.markedAnswersMain = new Array<boolean>(this.question.answersForMain.length);
    for(let i = 0; i < this.question.answersForMain.length; i++){
      this.markedAnswersMain[i] = false;
    }


  }

  generateHighestBox(answers: Array<string>): string{
    let max: number = -1;
    for(let i = 0; i < answers.length; i++){
      if(answers[i].length > max){
        max = answers[i].length;
      }
    }
    let size = Math.max((max * 20), 300);
    
    let returnedSize: string = (size.toString()) + 'px';
    console.log('returned size is: ' + returnedSize);
    return returnedSize;
  }
  markAnswerForMain(index: number){
    for(let i = 0; i < this.markedAnswerMain.length; i++){
      if(index == i){
        if(this.markedAnswersMain[i]){
          this.markedAnswerMain = 'Choose an answer';
          this.secondaryQuestionMode = false;
        }else{
          this.markedAnswerMain = this.question.answersForMain[i];
          if(this.question.secondaryQuestionsText[i] != null){
            this.secondaryQuestion = this.question.secondaryQuestionsText[i];
            let sizeOfSecondaryanswers = this.question.answersForSecondary[i].length;
            this.markedAnswersSecondary = new Array<boolean>(sizeOfSecondaryanswers);
            this.currentSecondaryAnswers = new Array<string>(sizeOfSecondaryanswers);
            for(let i = 0; i < this.markedAnswersSecondary.length; i++){
              this.markedAnswersSecondary[i] = false;
              this.currentSecondaryAnswers[i] = this.question.answersForSecondary[index][i];
              this.markedAnswerSecondery = 'Choose an answer';
              this.secondaryQuestionMode = true;
            }

          }else{
            this.secondaryQuestionMode = false;
          }
        }
        this.markedAnswersMain[i] = !this.markedAnswersMain[i];
      }else{
        this.markedAnswersMain[i] = false;
      }
    }
  }

  markAnswerForSecondary(index: number){
    for(let i = 0; i < this.currentSecondaryAnswers.length; i++){
      if(i == index){
        if(this.markedAnswersSecondary[i]){
          this.markedAnswerSecondery = 'Choose an answer';
        }else{
          this.markedAnswerSecondery = this.currentSecondaryAnswers[i];
        }
        this.markedAnswersSecondary[i] = !this.markedAnswersSecondary[i]; 
      }else{
        this.markedAnswersSecondary[i] = false;
      }
    }
  }

}
