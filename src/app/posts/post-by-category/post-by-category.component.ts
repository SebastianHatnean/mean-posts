import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-by-category',
  templateUrl: './post-by-category.component.html',
  styleUrls: ['./post-by-category.component.css'],
})
export class PostByCategoryComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoadiing = false;
  totalPosts = 0;
  categoryNumber;
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
    this.categoryNumber = this.router.url.charAt(this.router.url.length - 1);
    this.postsService.getPostsByCategory(this.categoryNumber);
    this.userId = this.authService.getUserId();
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
        this.postsService.getPostsByCategory(this.categoryNumber);
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
