import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.html'
})
export class App {

mode: 'german' | 'english' | 'puzzle' = 'german';

  word: any;
  loading: boolean = false;

  score: number = 0;
  total: number = 0;


  userAnswer: string = '';
  result: string = '';

  userAnswerGerman: string = '';
  resultGerman: string = '';

  originalWord: string = '';
  displayWord: string[] = [];
  userInputs: string[] = [];

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {
    this.loadWord();
  }


  loadWord() {
    this.loading = true;

    this.http.get(`${environment.apiUrl}/api/word/random`)
      .subscribe((data: any) => {

        this.word = data;

        this.originalWord = data.german.toUpperCase();

        this.generatePuzzle();

        // reset inputs
        this.userInputs = new Array(this.originalWord.length).fill('');

        this.userAnswer = '';
        this.result = '';

        this.userAnswerGerman = '';
        this.resultGerman = '';

        this.loading = false;
        this.cd.detectChanges();
      });
  }

  checkAnswer() {
    if (!this.word) return;

    this.total++;

    if (this.userAnswer.trim().toLowerCase() === this.word.english.toLowerCase()) {
      this.result = "✅ Correct!";
      this.score++;
    } else {
      this.result = "❌ Wrong!";
    }
  }

  checkGermanAnswer() {
    if (!this.word) return;

    if (this.userAnswerGerman.trim().toLowerCase() === this.word.german.toLowerCase()) {
      this.resultGerman = "✅ Correct!";
    } else {
      this.resultGerman = "❌ Wrong!";
    }
  }

  // Puzl generar
  generatePuzzle() {
    const word = this.originalWord;
    const length = word.length;

    let blanksCount = 2;
    if (length >= 6) blanksCount = 3;

    let result = word.split('');
    let positions: Set<number> = new Set();

    while (positions.size < blanksCount) {
      const index = Math.floor(Math.random() * (length - 2)) + 1;
      positions.add(index);
    }

    this.displayWord = result.map((char, index) =>
      positions.has(index) ? '_' : char
    );
  }

  // Puzzle check
  checkPuzzle() {
    let finalWord = '';

    for (let i = 0; i < this.displayWord.length; i++) {
      if (this.displayWord[i] === '_') {
        finalWord += (this.userInputs[i] || '').toUpperCase();
      } else {
        finalWord += this.displayWord[i];
      }
    }

    if (finalWord === this.originalWord) {
      alert('✅ Correct!');
    } else {
      alert('❌ Try again');
    }
  }
}