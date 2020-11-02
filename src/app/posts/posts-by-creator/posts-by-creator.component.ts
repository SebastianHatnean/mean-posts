import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-posts-by-creator',
  templateUrl: './posts-by-creator.component.html',
  styleUrls: ['./posts-by-creator.component.css']
})
export class PostsByCreatorComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoadiing = false;
  totalPosts = 0;
  openViewModal = false;
  postToView: Post;
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSubs: Subscription;

  constructor(
    private router: Router,
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoadiing = true;
    this.userId = this.authService.getUserId();
    this.postsService.getPostsByCreator(this.userId);
    this.postsSub = this.postsService
      .getPostUpdatedListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoadiing = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }

  onDelete(postId: string) {
    this.isLoadiing = true;
    this.postsService.deletePost(postId).subscribe(
      () => {
        this.postsService.getPostsByCreator(this.userId);
      },
      () => {
        this.isLoadiing = false;
      }
    );
  }

  openModal(post) {
    this.openViewModal = true;
    this.postToView = post;
  }

  closeModal() {
    this.openViewModal = false;
    this.postToView = null;
  }
}

