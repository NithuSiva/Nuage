import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuageDeMotsComponent } from './nuage-de-mots.component';

describe('NuageDeMotsComponent', () => {
  let component: NuageDeMotsComponent;
  let fixture: ComponentFixture<NuageDeMotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuageDeMotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuageDeMotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
