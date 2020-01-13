import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiochatComponent } from './audiochat.component';

describe('AudiochatComponent', () => {
  let component: AudiochatComponent;
  let fixture: ComponentFixture<AudiochatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudiochatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudiochatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
