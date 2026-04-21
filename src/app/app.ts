import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <h1>German Learning App</h1>
    <p>Score: {{ score }} / {{ total }}</p>

    <div *ngIf="word">
      <p><b>German:</b> {{ word.german }}</p>

      <input [(ngModel)]="userAnswer" placeholder="Type English word" />
      <button (click)="checkAnswer()">Check</button>

      <p *ngIf="result">{{ result }}</p>

<p *ngIf="result">
  <b>Answer:</b> {{ word.english }}
</p>

      <button (click)="loadWord()">Next Word</button>
    </div>
  `
})
export class App {
  score: number = 0;
total: number = 0;

  word: any;
  userAnswer: string = '';
  result: string = '';

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {
    this.loadWord();
  }

  loadWord() {
    this.http.get('https://demo-app-h5y3.onrender.com/api/word/random')
      .subscribe(data => {
        console.log("API DATA:", data);
        this.word = data;
        this.userAnswer = '';
        this.result = '';
        this.cd.detectChanges();
      });
  }


checkAnswer() {
  if (!this.word) return;

  this.total++;

  if (this.userAnswer.toLowerCase() === this.word.english.toLowerCase()) {
    this.result = "✅ Correct!";
    this.score++;
  } else {
    this.result = "❌ Wrong!";
  }
}
  
}