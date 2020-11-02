import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerpage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerpage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                category: post.category,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
                postCreator: post.postCreator,
                occupation: post.occupation,
                company: post.company,
                firstName: post.firstName,
                lastName: post.lastName,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transdormedPostData) => {
        this.posts = transdormedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transdormedPostData.maxPosts,
        });
      });
  }

  getPostsByCategory(category: any) {
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + 'category/' + category
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                category: post.category,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
                postCreator: post.postCreator,
                occupation: post.occupation,
                company: post.company,
                firstName: post.firstName,
                lastName: post.lastName,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
      });
  }

  getPostsByCreator(creator: any) {
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + 'creator/' + creator
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                category: post.category,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
                postCreator: post.postCreator,
                occupation: post.occupation,
                company: post.company,
                firstName: post.firstName,
                lastName: post.lastName,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
      });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
      postCreator: string;
      category: string;
      company: string;
      occupation: string;
      firstName: string;
      lastName: string;
    }>(BACKEND_URL + id);
  }

  addPost(
    title: string,
    content: string,
    image: File,
    category: string,
    occupation: string,
    company: string,
    firstName: string,
    lastName: string
  ) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    postData.append('category', category);
    postData.append('occupation', occupation);
    postData.append('company', company);
    postData.append('firstName', firstName);
    postData.append('lastName', lastName);
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(
    id: string,
    title: string,
    content: string,
    image: File | string,
    category: string,
    occupation: string,
    company: string,
    firstName: string,
    lastName: string
  ) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
      postData.append('category', category);
      postData.append('occupation', occupation);
      postData.append('company', company);
      postData.append('firstName', firstName);
      postData.append('lastName', lastName);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null,
        postCreator: null,
        category,
        occupation,
        company,
        firstName,
        lastName,
      };
    }
    this.http.put(BACKEND_URL + id, postData).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
