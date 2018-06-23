import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Question } from '../../models/index';

@Component({
  selector: 'app-block-preview',
  templateUrl: './block-preview.component.html',
  styleUrls: ['./block-preview.component.css']
})

/*
this class is responsible for previewing the block component.
when a test is being previewed, it triggers the block preview , that uses the sub
question viewer code.
One can think about this class as a screen, that each time presents a different block.
*/
export class BlockPreviewComponent implements OnInit {
  //the block input given to the class, that's the block we're about to preview.
  @Input() block:any;
  //we want to notify when we finish previewing the block.
  @Output() finished: EventEmitter<any> = new EventEmitter();
  //local variable to indicate when we finish previewing the block.
  finish: boolean = false;
  //the current index of the question in block.
  currIndex: number;

  parsedQuestion: Question;

  //default constructor.
  constructor() { 

  }

  //when the component is initialized. the current index is set to 0.
  ngOnInit() {
    this.currIndex = 0;

  }

  /*
  in the HTML file, each question is shown , only if the show question function returns true for it's index.
  meaning the only question that'll get true is the function that it's index is identical to our
  current index.
  Input - the index of some question in the list.
  Output - if the question index is identical to our current index we return true , so the ngIf if the HTML
  will get true and present the question.
  */
  showQuestion(index) {

    return index == this.currIndex;
  }

  /*
  this function increments out index and checks if we finished the list.
  if we did - it triggers an event to notify our caller that the preview of the block is done.
  */
  nextQuestion() {

    this.currIndex++;
    if (this.currIndex == this.block.questions.length) {
      this.finish = true;
      this.finished.emit(true);
    } else {

      this.finished.emit(false);
    }
  }

  parseToQuestion(text: string): Question {
    this.parsedQuestion = JSON.parse(text);
    return this.parsedQuestion;

  }
/*
  this.tickTick(6);
  console.log(this.block.questions[0].showDistractions);
  if(this.block.questions[0].showDistractions){
    console.log("first question has distractions!!");
    this.tickTick(parseInt(this.block.questions[0].seconds));
  }
  countdownCallback(){
      console.log("countdown timer finished ! moving question");
      this.nextQuestion();
    }

    seconds:string ="";
    minutes:string ="";
    clockDisplay:string=this.minutes + " : " + this.seconds;
    // clockDisplay:number;
    duration:number;
    interval;


    tickTick(duration) {
      this.duration = duration;
      if (this.duration > 0) {
          this.interval = setInterval(() => {
              this.duration--;

              if (this.duration == 0) {
                  clearInterval(this.interval);
                  this.nextQuestion();
              }
             if (this.duration % 60 < 10) {
                  this.seconds = "0" + this.duration % 60;
              } else {
                  this.seconds = (this.duration % 60).toString();
              }

              if (this.duration / 60 < 10) {
                  this.minutes = "0" + parseInt("" + this.duration / 60, 10);
              } else {
                  this.minutes = "" + parseInt((this.duration / 60).toString(), 10);
              }

             this.clockDisplay = this.minutes + " : " + this.seconds
          }, 1000);
      }
  }*/

}
