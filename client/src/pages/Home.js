import React from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { Grid } from 'semantic-ui-react'
import PostCard from '../components/PostCard'

export default function Home() {
	// destructuring loading and data obj, data obj being destructured to get the payload getPosts which is aliased to posts
	const { loading, data } = useQuery(FETCH_POSTS_QUERY);

	return (
		<Grid columns={3}>
			<Grid.Row className="page-title">
				<h1>Recent Posts</h1>
			</Grid.Row>
			<Grid.Row>
				{loading ? (
					<h1>Loading posts..</h1>
				) : (
						data.getPosts &&
						data.getPosts.map((post) => (
							<Grid.Column key={data.getPosts.id} style={{ marginBottom: 20 }}>
								<PostCard post={post} />
							</Grid.Column>
						))
					)}
			</Grid.Row>
		</Grid>
	);
}

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;