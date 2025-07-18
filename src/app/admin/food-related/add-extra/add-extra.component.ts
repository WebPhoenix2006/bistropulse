import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-extra',
  standalone: false,
  templateUrl: './add-extra.component.html',
  styleUrl: './add-extra.component.scss',
})
export class AddExtraComponent implements OnInit {
  imagePreview: string | ArrayBuffer | null = null;
  formData: { [key: string]: any } = {};
  restaurantId: string = '';

  constructor(private route: ActivatedRoute) {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result;
      };

      reader.readAsDataURL(file);
      this.formData['image'] = file;
    }
  }

  ngOnInit(): void {}

  removeImage(): void {
    this.imagePreview = null;
  }

  submitForm() {
    console.log('Submitted form data:', this.formData);
  }
}
