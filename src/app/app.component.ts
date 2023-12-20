import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'nuage';

  ngOnInit() {
    console.log("Allumé AppComponent");
    let div_presenation = document.getElementById('div_presentation');
    // div_presenation?.remove();
    if(div_presenation){
      div_presenation.classList.remove("div_cache");
      div_presenation.classList.add("div_voir");
    }
  }
}
