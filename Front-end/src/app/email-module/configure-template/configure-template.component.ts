import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TemplateService } from './configure-template.service'; // Service to handle API calls
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configure-template',
  standalone: true,
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './configure-template.component.html',
  styleUrl: './configure-template.component.css'
})
export class ConfigureTemplateComponent implements OnInit {

  templates : any[] = []; // Array to hold templates
  selectedTemplate: any = null; // Object to hold the selected template
  isEditing = false; // Flag to toggle edit mode

  constructor(private http: HttpClient, private templateService: TemplateService) {}

  ngOnInit(): void {
    this.fetchTemplates();
  }

  @ViewChild('previewSection') previewSection!: ElementRef;
  @ViewChild('editSection') editSection!: ElementRef;

  fetchTemplates() {
    this.http.get('http://localhost:5000/api/email/templates')
      .subscribe({
        next: (response: any) => {
          this.templates = response;
        },
        error: (error) => {
          console.error('Error fetching templates:', error);
        }
      });
  }

  selectTemplate(template: any) {
    this.selectedTemplate = template;
    this.isEditing = false;
  }

  previewTemplate(template: any, event: Event) {
    event.stopPropagation(); // Prevent the outer click event
    this.selectTemplate(template);
    setTimeout(() => {
      this.previewSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }

  editTemplate() {
    this.isEditing = true;
    setTimeout(() => {
      this.editSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }

  saveTemplate() {
    if (this.selectedTemplate) {
      this.templateService.updateTemplate(this.selectedTemplate).subscribe(
        response => {
          alert('Template updated successfully!');
          this.isEditing = false;
        },
        error => {
          console.error('Error updating template', error);
          alert('Failed to update template.');
        }
      );
    }
  }
}