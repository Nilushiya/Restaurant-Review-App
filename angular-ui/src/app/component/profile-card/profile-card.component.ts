import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  @Input() profileForm!: FormGroup;
  @Input() isEditing = false;

  @Output() edit = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
}
