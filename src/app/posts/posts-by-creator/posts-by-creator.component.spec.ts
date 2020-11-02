import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsByCreatorComponent } from './posts-by-creator.component';

describe('PostsByCreatorComponent', () => {
  let component: PostsByCreatorComponent;
  let fixture: ComponentFixture<PostsByCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostsByCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsByCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
