import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage
{

  @ViewChild('slides') slides : any;

  hasAnswered: boolean = false;
  score: number = 0;
  time: number =0;
  time_start: boolean=false;
  slideOptions: any;
  questions: any;
  private nbDifficulty: number;

  constructor(public navCtrl: NavController, public dataService: DataProvider) {}

  createAnswersArray(correct_answer,incorrect_answers)
  {
    let answers = [];
    answers[0]={"answer":correct_answer,"correct":true,"selected":false};
    for(let i=0;i<incorrect_answers.length;i++)
    {
      answers[i+1]={"answer":incorrect_answers[i],"correct":false,"selected":false};
    }
    return answers;
  }

  ionViewDidLoad()
  {
    this.slides.lockSwipes(true);

    /*this.dataService.load().then((data) => {
      data.results.map((question) => {
        let correct_answer=question.correct_answer;
        let incorrect_answers=question.incorrect_answers;

        let answers=this.createAnswersArray(correct_answer,incorrect_answers);
        question.answers = this.randomizeAnswers(answers);
        return question;
      });
      console.log(data.results);
      this.questions = data.results;
    })
    */
  }

  difficulty(value)
  {
    this.slides.lockSwipes(true);

    this.dataService.load(value).then((data) => {
      data.results.map((question) => {
        let correct_answer=question.correct_answer;
        let incorrect_answers=question.incorrect_answers;

        let answers=this.createAnswersArray(correct_answer,incorrect_answers);
        question.answers = this.randomizeAnswers(answers);
        return question;
      });
      console.log(data.results);
      this.questions = data.results;
    })
  }

  nextSlide(value)
  {
    if(value != undefined)
    {
      this.difficulty(value);

      switch(value)
      {
        case "easy": {
          this.nbDifficulty = 1;
          break;
        }
        case "medium": {
          this.nbDifficulty = 2;
          break;
        }
        case "hard": {
          this.nbDifficulty = 4;
          break;
        }
      }

      setTimeout(() => {
        this.slides.lockSwipes(false);
        this.slides.slideNext();
        this.slides.lockSwipes(true);
      }, 1000)
      this.time_start=true;
      this.timer();
    }
    else
    {
      this.slides.lockSwipes(false);
      this.slides.slideNext();
      this.slides.lockSwipes(true);
    }
    if(this.slides.isEnd())
      this.time_start=false;
  }

  selectAnswer(answer, question)
  {
    this.hasAnswered = true;
    answer.selected = true;
    question.flashCardFlipped = true;

    if(answer.correct)
    {
      this.score = this.score + 5 * this.nbDifficulty;
    }
    else
    {
      this.score = this.score + 5 * -(this.nbDifficulty);
    }

    setTimeout(() => {
      this.hasAnswered = false;
      // @ts-ignore
      this.nextSlide();
      answer.selected = false;
      question.flashCardFlipped = false;
    }, 3000);
  }

  randomizeAnswers(rawAnswers: any[]): any[] {
    for (let i = rawAnswers.length - 1; i > 0; i--)
    {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = rawAnswers[i];
      rawAnswers[i] = rawAnswers[j];
      rawAnswers[j] = temp;
    }

    return rawAnswers;
  }

  restartQuiz()
  {
    this.time = 0;
    this.time_start=true;
    this.score = 0;
    this.slides.lockSwipes(false);
    this.slides.slideTo(1, 1000);
    this.slides.lockSwipes(true);
  }

  timer()
  {
    setTimeout(() => {
      if(this.time_start==false)
      {

      }else{
        this.time++;
      }
      console.log(this.time);
      this.timer();
    },1000);
  }
}
