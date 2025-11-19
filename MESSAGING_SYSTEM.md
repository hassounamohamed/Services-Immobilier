# Messaging System Documentation

## Overview
A complete real-time messaging system has been implemented allowing users to contact property owners and receive notifications about messages.

## Features Implemented

### 1. **Conversation Management**
- Users can start conversations from property details
- Automatic conversation creation or retrieval if already exists
- Real-time conversation updates with Firestore listeners
- Unread message counts per user
- Property information attached to conversations (title, image)

### 2. **Messaging**
- Real-time message delivery using Firestore
- Message timestamp and read status tracking
- Sender/receiver identification
- Conversation-based message grouping
- Auto-scroll to latest messages

### 3. **Notification System**
- Automatic notifications when receiving messages
- Real-time notification updates
- Unread notification badges
- Mark as read functionality
- Notification types: message, favorite, property
- Direct navigation to related content from notifications

### 4. **UI Components**

#### PropertyDetailsScreen
- "Message" button creates/finds conversation with property owner
- Prevents users from messaging themselves
- Requires authentication to message

#### MessagesScreen
- Lists all conversations with real-time updates
- Shows property images and titles
- Displays unread message counts with badges
- Shows last message preview
- Time formatting (minutes, hours, days ago)
- Loading and empty states

#### ChatScreen
- Real-time message display
- Property title in header
- Send button with loading state
- Message bubbles (user's messages vs received)
- Keyboard-avoiding view for better UX
- Automatic notification creation on send

#### NotificationsScreen
- Real-time notification list
- Unread count display
- "Mark all as read" functionality
- Interactive notifications (tap to navigate)
- Settings for notification preferences
- Empty and loading states

## Firebase Collections Structure

### `conversations`
```javascript
{
  id: string,
  participants: [userId1, userId2],
  propertyId: string,
  propertyTitle: string,
  propertyImage: string,
  lastMessage: string,
  lastMessageTime: Timestamp,
  unreadCount: {
    [userId1]: number,
    [userId2]: number
  },
  createdAt: Timestamp
}
```

### `messages`
```javascript
{
  id: string,
  conversationId: string,
  senderId: string,
  receiverId: string,
  text: string,
  timestamp: Timestamp,
  read: boolean
}
```

### `notifications`
```javascript
{
  id: string,
  userId: string,
  title: string,
  message: string,
  type: 'message' | 'favorite' | 'property',
  relatedId: string,
  read: boolean,
  createdAt: Timestamp
}
```

## Firebase Service Functions

### Conversation Functions
- `findOrCreateConversation()` - Creates new or finds existing conversation
- `updateConversation()` - Updates last message and increments unread count
- `markConversationAsRead()` - Resets unread count for a user
- `getConversations()` - Retrieves user's conversations

### Notification Functions
- `createNotification()` - Creates a new notification
- `getNotifications()` - Retrieves user's notifications
- `markNotificationAsRead()` - Marks notification as read
- `getUnreadNotificationCount()` - Gets count of unread notifications

## Custom Hooks

### `useNotifications(userId)`
Returns:
- `notifications` - Array of notification objects
- `unreadCount` - Number of unread notifications
- `loading` - Loading state
- `error` - Error message if any
- `markAsRead(notificationId)` - Function to mark single notification as read
- `markAllAsRead()` - Function to mark all notifications as read

## Usage Flow

### Starting a Conversation
1. User views property details
2. Clicks "Message" button
3. System checks if conversation exists between user and property owner
4. If exists, navigates to existing conversation
5. If not, creates new conversation with property context
6. Opens ChatScreen with conversation ID

### Sending a Message
1. User types message in ChatScreen
2. Clicks send button
3. Message saved to `messages` collection
4. Conversation updated with last message and timestamp
5. Receiver's unread count incremented
6. Notification created for receiver
7. Message appears in real-time for both users

### Receiving Notifications
1. User receives message
2. Notification automatically created
3. Notification appears in NotificationsScreen
4. Badge shows unread count
5. User taps notification
6. Navigates to relevant screen (Chat, Property Details)
7. Notification marked as read

## Real-time Updates

All screens use Firestore `onSnapshot` listeners for real-time updates:
- MessagesScreen: Updates when new messages arrive or conversations change
- ChatScreen: Updates when new messages sent/received
- NotificationsScreen: Updates when new notifications created

## Security Considerations

⚠️ **Important**: Firebase Security Rules need to be configured:

```javascript
// Conversations - users can only read their own
match /conversations/{conversationId} {
  allow read: if request.auth != null && 
    request.auth.uid in resource.data.participants;
  allow create: if request.auth != null;
  allow update: if request.auth != null && 
    request.auth.uid in resource.data.participants;
}

// Messages - users can only read their conversation messages
match /messages/{messageId} {
  allow read: if request.auth != null &&
    (request.auth.uid == resource.data.senderId || 
     request.auth.uid == resource.data.receiverId);
  allow create: if request.auth != null &&
    request.auth.uid == request.resource.data.senderId;
}

// Notifications - users can only read their own
match /notifications/{notificationId} {
  allow read: if request.auth != null && 
    request.auth.uid == resource.data.userId;
  allow write: if request.auth != null;
}
```

## Firestore Indexes Required

Create these composite indexes in Firebase Console:

1. **conversations**
   - `participants` (Arrays) + `lastMessageTime` (Descending)

2. **messages**
   - `conversationId` (Ascending) + `timestamp` (Ascending)

3. **notifications**
   - `userId` (Ascending) + `createdAt` (Descending)
   - `userId` (Ascending) + `read` (Ascending)

## Testing Checklist

- [ ] User can message property owner from property details
- [ ] Conversation created only once per user-property pair
- [ ] Messages send and receive in real-time
- [ ] Unread counts update correctly
- [ ] Notifications created when receiving messages
- [ ] Notifications clickable and navigate correctly
- [ ] Mark as read functionality works
- [ ] Empty states display correctly
- [ ] Loading states display correctly
- [ ] Users cannot message themselves
- [ ] Unauthenticated users prompted to login

## Future Enhancements

Potential improvements:
- Push notifications (using Expo Notifications)
- Image/photo sharing in messages
- Message deletion
- Block/report users
- Typing indicators
- Message read receipts
- Conversation search
- Message search within conversations
- Archive conversations
- Delete conversations
- Group messaging
