import { Component, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiDataService } from '../services/api-data.service';


@Injectable({
  providedIn: 'root'
})
export class CallApiService {

  private url = "";
  private channel_name = "";
  private key = "";
  private data: any;
  http: any;

  constructor(private _httpClient: HttpClient, private apiDataService: ApiDataService, private router: Router) {
  }

  getCommentId(videoId: string) {
    this.callCommentUrl(videoId, this.key, 50);
  }

  search_channel(form_recherche: any) {
    this.channel_name = form_recherche.form.value.input_recherche;
    this.key = form_recherche.form.value.api_key;
    this.callChannelUrl(this.channel_name, this.key, 10);
  }
  
  callChannelUrl(channel_name: string, key: string, nb_videos: number) {
    this.url = "https://youtube.googleapis.com/youtube/v3/search?&key=" + key + "&channelId=" + channel_name + "&part=snippet,id&maxResults=" + nb_videos
    console.log(this.url);
    this._httpClient.get(this.url)
    .subscribe(data => {
      this.data = (<any>data).items;
      this.createGrid();
    });
  }

  callCommentUrl(videoId: string, key: string, nb_comments: number) {
    this.url = "https://www.googleapis.com/youtube/v3/commentThreads?key=" + key + "&textFormat=plainText&part=snippet&videoId=" + videoId + "&maxResults=" + nb_comments;
    this._httpClient.get(this.url)
    .subscribe(data => {
      this.data = (<any>data).items;
      this.apiDataService.setData(this.data);
      this.router.navigate(['/comments']);
  });
    
  }

  createGrid() {
    let div_principale = document.getElementById("div_principale");
    let old_div_container_videos = document.getElementById('div_container_videos')
    if(old_div_container_videos && div_principale){
      div_principale.removeChild(old_div_container_videos);
    }
    let div_container_videos = document.createElement('div');
    div_container_videos.setAttribute('id',"div_container_videos");
    div_container_videos.classList.add("div_container_videos");

    this.data.forEach((video: any) => {
      let div_video = document.createElement("div");
      div_video.classList.add("div_video");

      let div_video_miniature = document.createElement("div");

      let div_video_title = document.createElement("h3");
      div_video_title.classList.add("div_video_title");
      div_video_title.innerHTML = video.snippet.description;

      let div_boutton_analyse = document.createElement("button");
      div_boutton_analyse.classList.add("div_boutton_analyse");
      div_boutton_analyse.innerHTML = "Commentaires Analyse"
      div_video.setAttribute('id', video.id.videoId)
      // div_boutton_analyse.setAttribute('click', "getCommentId("+video.id.videoId+")");
      div_video.addEventListener('click', (event) => {
        this.getCommentId(video.id.videoId);
      });
      // div_boutton_analyse.setAttribute('onClick', "console.log('test')");

      let image = document.createElement("img");
      image.src = video.snippet.thumbnails.default.url;
      image.classList.add("img_video_miniature");

      div_video_miniature.appendChild(image);
      div_video.appendChild(div_video_miniature);
      div_video.appendChild(div_video_title);
      div_container_videos.appendChild(div_video);
    });
    if(div_principale){
      div_principale.appendChild(div_container_videos);
    }
  }

}
