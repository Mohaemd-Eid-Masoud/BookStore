import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  onSubmit() {
    // Handle form submission
    alert('Thank you for your message! We will get back to you soon.');
  }
}
