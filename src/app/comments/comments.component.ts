
import { Component, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiDataService } from '../services/api-data.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
  providers: [HttpClient]
})

export class CommentsComponent implements OnInit {

  private dataComments: any;

  constructor(private _httpClient: HttpClient, private apiDataService: ApiDataService, private router: Router) {
    console.log("constructor CommentsComponent");
    this.apiDataService.data$.subscribe((value: any) => {
      console.log("Value: ", value);
    });
  }

  ngOnInit(): void {
    console.log("ngOnInit CommentsComponent");
    this.apiDataService.data$.subscribe((value: any) => {
      this.dataComments = value;
    });
    this.sortDataComments();
  }

  sortDataComments() {
    console.log("Sort :", this.dataComments);
    let newArray: { author: any; authorImage:any; comment: any; }[] = [];
    this.dataComments.forEach((comment: any) => {
      newArray.push({"author": comment.snippet.topLevelComment.snippet.authorDisplayName, "authorImage": comment.snippet.topLevelComment.snippet.authorProfileImageUrl, "comment" : comment.snippet.topLevelComment.snippet.textOriginal})
    });

    this.generateGrid(newArray);
  }

  generateGrid(commentsArray: any) {
    let div_principale = document.getElementById("div_principale");
    let old_div_container_comments = document.getElementById('div_container_comments')
    if(old_div_container_comments && div_principale){
      div_principale.removeChild(old_div_container_comments);
    }
    let div_container_comments = document.createElement('div');
    div_container_comments.setAttribute('id',"div_container_comments");
    div_container_comments.classList.add("div_container_comments");

    commentsArray.forEach((comment: any) => {
      let div_comment = document.createElement("div");
      div_comment.classList.add("div_comment");

      let div_comment_miniature = document.createElement("div");
      div_comment_miniature.classList.add("div_comment_miniature");



      let div_comment_title = document.createElement("h3");
      div_comment_title.classList.add("div_comment_title");
      div_comment_title.innerHTML = comment.comment;


      let img_pdp = document.createElement("img");
      img_pdp.src = comment.authorImage;
      img_pdp.classList.add("img_pdp");


      let p_author_name = document.createElement("p");
      p_author_name.innerHTML = comment.author;
      p_author_name.classList.add("p_author_name");

      div_comment_miniature.appendChild(img_pdp);
      div_comment_miniature.appendChild(p_author_name);
      div_comment.appendChild(div_comment_miniature);
      div_comment.appendChild(div_comment_title);
      div_container_comments.appendChild(div_comment);
    });
    if(div_principale){
      div_principale.appendChild(div_container_comments);
    }
  }
  
}