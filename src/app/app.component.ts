import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Voice = {
  name: string
  files: string[]
};

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-root',
  //templateUrl: './app.component.html',
  template: `
<main>
  <form>
    <select name="voiceSelect" [(ngModel)]="selectedVoice">
      <option *ngFor="let voice of voices" [ngValue]="voice">{{ voice.name }}</option>
    </select>
    <br />
    <textarea name="userTextArea" type="text" placeholder="What do you want to say?" [(ngModel)]="textValue" (input)="onKeyPress($event)">{{textValue}}</textarea>
    <br />
    <button (click)="playSound()">Talk!</button>
  </form>
</main>
`,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Voice Emulator';

  DELAY = 100;
  voicesDirectory = "wav/"
  voices: Voice[] = [
    {
      name: "Sans", files: [
        "snd_txtsans.wav",
        "snd_txtsans2.wav",
      ],
    },
    {
      name: "Tal", files: [
        "snd_txtal.wav",
      ],
    },
    {
      name: "Asg", files: [
        "snd_txtasg.wav",
      ],
    },
    {
      name: "Asr", files: [
        "snd_txtasr.wav",
        "snd_txtasr2.wav",
      ],
    },
    {
      name: "Pap", files: [
        "snd_txtpap.wav",
      ],
    },
    {
      name: "Tor", files: [
        "snd_txttor.wav",
        "snd_txttor2.wav",
        "snd_txttor3.wav",
      ],
    },
    {
      name: "Und", files: [
        "snd_txtund.wav",
        "snd_txtund2.wav",
        "snd_txtund3.wav",
        "snd_txtund4.wav",
      ],
    },
    {
      name: "Und_hyper", files: [
        "snd_txtund_hyper.wav",
      ],
    },
    {
      name: "Ghaster", files: [
        "snd_wngdng1.wav",
        "snd_wngdng2.wav",
        "snd_wngdng3.wav",
        "snd_wngdng4.wav",
        "snd_wngdng5.wav",
        "snd_wngdng6.wav",
        "snd_wngdng7.wav",
      ],
    },
  ];
  selectedVoice = this.voices[0];

  textValue = "test 1 2 34";

  onKeyPress(event: Event) {
    console.log("event fired");
    if (event.target instanceof HTMLTextAreaElement) {
      this.textValue = event.target.value;
    }
  }

  countSyllables(word: string) {
    // Turns out perfect counting of syllables is complicated. We'll use a cheap heuristic and test that it is correct enough.
    // Will fail on this list, but that's ok: https://en.wikipedia.org/wiki/List_of_the_longest_English_words_with_one_syllable
    word = word.toLowerCase();

    let isVowelChain = false;
    let wordSyllables = 0;
    const vowels = 'aeiouy';
    // trim final e, often these are silent: sane vs committee
    if (word.endsWith('e')) word = word.substring(0, word.length - 1);
    for (let char of word) {
      // each digit will count as one syllable
      if (char >= '0' && char <= '9') wordSyllables++;
      // Add one syllable for each group of consecutive vowels
      else if (vowels.indexOf(char) >= 0) isVowelChain = true;
      else if (isVowelChain && vowels.indexOf(char) == -1) {
        wordSyllables++;
        isVowelChain = false;
      }
    }

    return Math.max(1, wordSyllables);
  }

  async playSound() {
    let syllables = this.textValue.split(' ').map(word => this.countSyllables(word));
    let numSyllables = syllables.reduce((a, b) => a + b, 0);
    // TODO: debug and learn
    console.info(`Now playing ${this.selectedVoice.name} ` + numSyllables + " times");

    let buffer = new Int8Array(numSyllables);
    window.crypto.getRandomValues(buffer);

    for (let n of buffer) {
      let selectedFile = this.selectedVoice.files[Math.abs(n) % this.selectedVoice.files.length];
      let audio = new Audio(this.voicesDirectory + selectedFile);
      audio.load();
      await audio.play();
      await new Promise((res) => setTimeout(res, this.DELAY));
    };
  }
}
