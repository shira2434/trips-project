import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// קומפוננטת השורש של האפליקציה
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // כותרת האפליקציה
  protected readonly title = signal('ANGULAR-PROJECT');
}
