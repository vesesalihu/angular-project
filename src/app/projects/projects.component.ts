import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RestService } from '../rest.service';
import { IProject } from '../models/project.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  public projects: IProject[] = [];
  public form: FormGroup;
  name: string = "";
  projectid: string = "";

  constructor(public fb: FormBuilder, private restService: RestService, private dialog: MatDialog) {
    this.form = this.fb.group({
      name: ['']
    });
  }

  ngOnInit(): void {
    this.getData();
    this.restService.RequiredRefresh.subscribe(r => {
      this.getData();
    });
  }

  public getData() {
    this.projects = [];
    this.restService.getProjectsData().subscribe((response: IProject[]) => {
      for (var i = 0; i < response.length; i++) {
        this.projects.push(response[i]);
      }
    })
  }

  submitForm() {
    this.restService.postProject(this.form.get('name')?.value)
      .subscribe({
        next: (response) => console.log(response),
        error: (error) => console.log(error),
      });
    this.form.setValue({ name: '' });
  }

  deleteProject(id: string) {
    this.restService.deleteProject(id).subscribe(
      data => {
        console.log('deleted response', data);
        this.getData();
      }
    )
  }

  editProject(id: string, name: string) {
    this.projectid = id;
    this.name = name;
  }

  update(id: string, name: string) {
    this.restService.updateProject(id, name).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
    this.form.setValue({ name: '' });
  }

  closeModal() {
    this.form.setValue({ name: '' });
  }


}
