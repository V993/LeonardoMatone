// src/components/BlogPage.js
import React from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, Grid } from '@mui/material';
import { blogPosts as blogPostsData } from '../data';

function BlogPage() {
  const blogPosts = blogPostsData ?? [];
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Blog
      </Typography>
      <Grid container spacing={4}>
        {blogPosts.map((post, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h5">{post.title}</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {post.snippet}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" href={post.link} color="primary">
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default BlogPage;



// function BlogSection() {
//   const blogPosts = [
//     {
//       title: 'Blog Post One',
//       snippet: 'Snippet of the first blog post...',
//       link: '/blog/post-one',
//     },
//     {
//       title: 'Blog Post Two',
//       snippet: 'Snippet of the second blog post...',
//       link: '/blog/post-two',
//     },
//     // Add more blog posts
//   ];

//   return (
//     <Box
//       id="blog"
//       sx={{
//         minHeight: '100vh', // Full viewport height
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         px: 3,
//         scrollSnapAlign: 'start'
//       }}
//     >
//       <Typography variant="h4" gutterBottom>
//         Blog
//       </Typography>
//       <Grid container spacing={4}>
//         {blogPosts.map((post, index) => (
//           <Grid item xs={12} md={6} key={index}>
//             <Card elevation={2}>
//               <CardContent>
//                 <Typography variant="h5">{post.title}</Typography>
//                 <Typography variant="body2" color="text.secondary" paragraph>
//                   {post.snippet}
//                 </Typography>
//               </CardContent>
//               <CardActions>
//                 <Button size="small" href={post.link} color="primary">
//                   Read More
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }

// export default BlogSection;
