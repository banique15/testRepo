import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const activitiesFile = path.join(dataDir, 'activities.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize activities file if it doesn't exist
if (!fs.existsSync(activitiesFile)) {
  fs.writeFileSync(activitiesFile, JSON.stringify([]));
}

function getActivities() {
  try {
    const data = fs.readFileSync(activitiesFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading activities:', error);
    return [];
  }
}

function saveActivities(activities) {
  try {
    fs.writeFileSync(activitiesFile, JSON.stringify(activities, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving activities:', error);
    return false;
  }
}

export async function GET({ request }) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId') || 'default';
  
  const activities = getActivities();
  const userActivities = activities.filter(activity => activity.userId === userId);
  
  return new Response(JSON.stringify(userActivities), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { title, start, end, userId = 'default', description = '', type = 'default' } = body;
    
    if (!title || !start) {
      return new Response(JSON.stringify({ error: 'Title and start date are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const activities = getActivities();
    const newActivity = {
      id: Date.now().toString(),
      title,
      start,
      end: end || start,
      userId,
      description,
      type,
      created: new Date().toISOString()
    };
    
    activities.push(newActivity);
    
    if (saveActivities(activities)) {
      return new Response(JSON.stringify(newActivity), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to save activity' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT({ request }) {
  try {
    const body = await request.json();
    const { id, title, start, end, userId = 'default', description = '', type = 'default' } = body;
    
    if (!id || !title || !start) {
      return new Response(JSON.stringify({ error: 'ID, title and start date are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const activities = getActivities();
    const activityIndex = activities.findIndex(activity => activity.id === id && activity.userId === userId);
    
    if (activityIndex === -1) {
      return new Response(JSON.stringify({ error: 'Activity not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    activities[activityIndex] = {
      ...activities[activityIndex],
      title,
      start,
      end: end || start,
      description,
      type,
      updated: new Date().toISOString()
    };
    
    if (saveActivities(activities)) {
      return new Response(JSON.stringify(activities[activityIndex]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to update activity' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE({ request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const userId = url.searchParams.get('userId') || 'default';
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Activity ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const activities = getActivities();
    const activityIndex = activities.findIndex(activity => activity.id === id && activity.userId === userId);
    
    if (activityIndex === -1) {
      return new Response(JSON.stringify({ error: 'Activity not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    activities.splice(activityIndex, 1);
    
    if (saveActivities(activities)) {
      return new Response(JSON.stringify({ message: 'Activity deleted successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to delete activity' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}