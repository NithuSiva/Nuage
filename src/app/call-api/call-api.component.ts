// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-call-api',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './call-api.component.html',
//   styleUrl: './call-api.component.css'
// })
// export class CallApiComponent {

// }


import { Component, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiDataService } from '../services/api-data.service';

@Component({
  selector: 'app-call-api',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './call-api.component.html',
  styleUrl: './call-api.component.css',
  providers: [HttpClient]
})

@Injectable({
  providedIn: 'root',
})

export class CallApiComponent implements OnInit {

  private url = "";
  private channel_name = "";
  private key = "";
  private data: any;
  private order: any;
  private nb_videos: any;
  http: any;
  
  constructor(private _httpClient: HttpClient, private apiDataService: ApiDataService, private router: Router) {
  }

  ngOnInit() {
    console.log("Allumé CallApiComponent");
    let div_presenation = document.getElementById('div_presentation');
    div_presenation?.remove();
  }

  commentsPage() {
    this.router.navigate(['/comments']);
  }
  
  getCommentId(videoId: string) {
    this.callCommentUrl(videoId, this.key, 50);
  }

  search_channel(form_recherche: any) {
    console.log("APPUYER");
    this.channel_name = form_recherche.form.value.input_recherche;
    this.key = form_recherche.form.value.api_key;
    this.order = form_recherche.form.value.select_order;
    this.nb_videos = Number(form_recherche.form.value.select_nb);

    type OrderOptions = {
      [key: string]: string;
    };
    
    let options: OrderOptions = {
      "Popularité": 'videoCount',
      "Récent": 'date',
      "Poce Blo": 'rating',
      "Titre ordre alphabetique": 'title',
      "Pertinence": 'relevance'
    };
    
    let key: keyof OrderOptions =  this.order;
    this.order = options[key];
    this.callChannelUrl2();
  }
  
  callChannelUrl(channel_id: any) {
    let url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + channel_id + "&order=" + this.order + "&maxResults=" + this.nb_videos  + "&type=video&key=" + this.key
    console.log(url);
    this._httpClient.get(url)
    .subscribe(dataHttp => {
      this.data = (<any>dataHttp).items;
      console.log("LISTE VIDEOS : ", this.data);
      this.createGridVideos();
    });

  }

  callChannelUrl2() {
    let url = "https://www.googleapis.com/youtube/v3/search?part=id&q=" + this.channel_name + "&type=channel&key=" + this.key;
    console.log(url);
    console.log(this.channel_name);
    this._httpClient.get(url)
    .subscribe(dataHttp => {
      this.data = (<any>dataHttp).items;
      console.log("LISTE CHAINE : ", this.data);
      this.callChannelAccount(this.data);
    });
  }

  callChannelAccount(list_channel: any){

    let div_principale = document.getElementById("div_principale");
    let old_div_container_channels = document.getElementById('div_container_channels')
    if(old_div_container_channels && div_principale){
      div_principale.removeChild(old_div_container_channels);
    }

    let old_div_container_videos = document.getElementById('div_container_videos')
    if(old_div_container_videos && div_principale){
      div_principale.removeChild(old_div_container_videos);
    }

    let div_container_channels = document.createElement('div');
    div_container_channels.setAttribute('id',"div_container_channels");
    div_container_channels.classList.add("div_container_channels");

    list_channel.forEach((element:any) => {
      console.log("Chaine :", element.id.channelId);
      let url = "https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=" + element.id.channelId + "&key=" + this.key;
      this._httpClient.get(url)
      .subscribe(dataHttp => {
        let channel = (<any>dataHttp).items;
        console.log();

        let div_channels_miniature = document.createElement("div");
        div_channels_miniature.classList.add("div_channels_miniature");

        let button_image : HTMLButtonElement=<HTMLButtonElement>document.createElement("button");
        button_image.classList.add("button_image");
        // button_image.addEventListener('click',  this.callChannelUrl(element.id.channelId, 10))
        button_image.addEventListener('click', (e:Event) => this.callChannelUrl(element.id.channelId));
        let image = document.createElement("img");
        image.src = channel[0].snippet.thumbnails.high.url;
        image.classList.add("img_channel_miniature");

        button_image.appendChild(image);
        div_channels_miniature.appendChild(button_image);
        div_container_channels.appendChild(div_channels_miniature);
        if(div_principale){
          div_principale.appendChild(div_container_channels);
        }
      });
    });
  }

  callCommentUrl(videoId: string, key: string, nb_comments: number) {
    this.url = "https://www.googleapis.com/youtube/v3/commentThreads?key=" + key + "&textFormat=plainText&part=snippet&order=relevance&videoId=" + videoId + "&maxResults=" + nb_comments;
    this._httpClient.get(this.url)
    .subscribe(data => {
      this.data = (<any>data).items;
      this.apiDataService.setUrl(this.url);
      this.apiDataService.setData(this.data);
      this.router.navigate(['/comments']);
  });
    
  }

  createGridVideos() {
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
