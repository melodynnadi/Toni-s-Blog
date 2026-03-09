# Firestore Setup Guide

## Collections Structure

### `posts` collection
Each document represents a blog post.

| Field       | Type      | Description                       |
|-------------|-----------|-----------------------------------|
| title       | string    | Post title                        |
| slug        | string    | URL-friendly slug                 |
| content     | string    | Markdown content                  |
| excerpt     | string    | Short preview text                |
| category    | string    | Category name                     |
| image       | string    | Cover image URL                   |
| author      | string    | Author name                       |
| published   | boolean   | Whether the post is visible       |
| created_at  | timestamp | When the post was created         |
| updated_at  | string    | Last update ISO string            |

### `comments` collection
Each document represents a comment on a post.

| Field      | Type      | Description                        |
|------------|-----------|------------------------------------|
| post_id    | string    | ID of the post this comment is on  |
| name       | string    | Commenter's name                   |
| comment    | string    | Comment text                       |
| created_at | timestamp | When the comment was posted        |

## Required Firestore Indexes

Create these composite indexes in the Firebase Console under **Firestore > Indexes**:

1. **posts** collection:
   - `published` (Ascending) + `created_at` (Descending)
   - `published` (Ascending) + `category` (Ascending) + `created_at` (Descending)
   - `slug` (Ascending) + `published` (Ascending)

2. **comments** collection:
   - `post_id` (Ascending) + `created_at` (Descending)

## Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts: anyone can read published posts, only authenticated users can write
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Comments: anyone can read and create, only authenticated users can delete
    match /comments/{commentId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

## Firebase Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /blog-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Setup Steps

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** > **Email/Password** sign-in method
4. Create an admin user in Authentication > Users
5. Enable **Cloud Firestore** (start in production mode, then add the rules above)
6. Enable **Storage** (add the rules above)
7. Go to Project Settings > General > Your Apps > Add a Web App
8. Copy the Firebase config values into your `.env.local` file
