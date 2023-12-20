
import { Component, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiDataService } from '../services/api-data.service';
import stopWord from '../../assets/stop_words_french.json';

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
  private listComments: String[] = [];
  private wordText: any = "";
  private stop_word: any = stopWord;
  constructor(private _httpClient: HttpClient, private apiDataService: ApiDataService, private router: Router) {
    console.log("CommentsComponent");
  }

  ngOnInit(): void {
    this.apiDataService.data$.subscribe((value: any) => {
      this.dataComments = value;
    });
    this.sortDataComments();
  }

  sortDataComments() {

    let newArray: { author: any; authorImage:any; comment: any; }[] = [];
    this.dataComments.forEach((comment: any) => {
      newArray.push({"author": comment.snippet.topLevelComment.snippet.authorDisplayName, "authorImage": comment.snippet.topLevelComment.snippet.authorProfileImageUrl, "comment" : comment.snippet.topLevelComment.snippet.textOriginal})
      this.listComments.push(comment.snippet.topLevelComment.snippet.textOriginal);
    });

    this.generateGrid(newArray);
   
    for( let comment of this.listComments) {
      let listWord = comment.split(' ');
      listWord.forEach(word => {
        this.wordText += " " + word;
      });
    }

    this.wordText = this.wordText.split(' ')
    const occurrences: { [mot: string]: number } = {};

    this.wordText.forEach((mot: string) => {
      // Convertir le mot en minuscules (ou majuscules) pour une recherche insensible à la casse
      const motEnMinuscules = mot.toLowerCase();

      if (occurrences.hasOwnProperty(motEnMinuscules)) {
        occurrences[motEnMinuscules]++;
      } else {
        occurrences[motEnMinuscules] = 1;
      }
    });


    // Le tableau trié est maintenant stocké dans occurrencesArray
    // const motsVides = ['le', 'et', 'de', 'la', 'un', 'une', 'il', 'elle', 'les', 'des', 'à', 'qui', 'en', '', 'pour', 'pas', 'est', 'que', 'je', 'au', 'a', 'on', "c'est", 'sont', 'tous', 'tout',
    //                     'par', 'du', '.', '-', 'ça', 'nos', "d'une", 'son', 'cette', 'aussi', 'dans', 'mais', 'nous', 'vous', 'ils', 'elles', "m'en", "n'a", 'y', 'très',
    //                     'ses', "j'ai", 'aux', 'se', 'ne', 'ces', 'vos', 'votre', 'quand', 'ont', 'non', 'oui', 'cela', 'ce', 'faut', 'cela', 'etait', 'trop', 'meme', 'même',
    //                     'faire', 'avec', 'jamais', 'ou', 'sur', 'sous', 'suis', 'me', 'là', 'rien', 'depuis', ',', 'plus', 'alors', 'vu', 'deja', 'déjà', 'ta', 'ton', 'toi', 'encore', 'merci',
    //                     'tu', '!', 'bien', 'mal', 'bravo', 'comme', 'as', 'vraiment', 'just', "c'est", 'belle', 'sans', 'fait', 'fais', "qu'il", "qu'elle", "qu'ils", "qu'elles", 'peu', 'beaucoup',
    //                     'un', 'pres', 'près', 'car', 'moi', 'viens', "n'est", 'contre', 'pour', 'où', 'joué'];
    console.log(this.stop_word)

    // Exclure les mots vides de la linste d'occurrences
    const occurrencesFiltrees = Object.fromEntries(
      Object.entries(occurrences)
        // .filter(([mot]) => !motsVides.includes( mot.toLowerCase()))
        .filter(([mot]) => !this.stop_word.includes(mot.toLowerCase()) && 
                           mot.length > 2 &&
                           mot.indexOf("'") === -1 &&
                           mot.indexOf(".") === -1)
    );
    let array_sort = this.sort(occurrencesFiltrees)
    console.log("Filter : ", array_sort);
    this.generateNuage(array_sort);
  }

  sort(list: any){
    const occurrencesArray = Object.entries(list);

    // Trier le tableau en fonction des valeurs (par nombre d'occurrences)
    occurrencesArray.sort((a:any, b:any) => b[1] - a[1]);

    return occurrencesArray;
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
      
      p_author_name.innerHTML = comment.author.replace('@', '');
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

  generateNuage(filtre: any) {

    let div_nuage = document.getElementById('div_nuage')
    let ul_nuage = document.createElement('ul');
    ul_nuage.classList.add("ul_nuage");
    let color =  ["#FF0000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#FFA500",
      "#800080",
      "#FFC0CB",
      "#00FFFF",
      "#A52A2A",
      "#FFFFFF",
  ];

    for(let i = 0; i < 20; i++){

      let randomIndex = Math.floor(Math.random() * color.length);
      
      let li_mot = document.createElement('li');

      let a_mot = document.createElement('a');
      console.log(filtre.some(Array.isArray) && !filtre.some((subArray: any[]) => subArray.some(Array.isArray)))
      try {
        a_mot.innerHTML = filtre[i][0];
        let taille = Number(filtre[i][1]) * 0.25 + 1;

        a_mot.style.fontSize = taille + 'rem';
        a_mot.style.color = color[randomIndex];
        li_mot.appendChild(a_mot);    
        ul_nuage.appendChild(li_mot);
      } catch (erreur){
        console.log(erreur);
      }
    }
    div_nuage?.appendChild(ul_nuage);
  }
}