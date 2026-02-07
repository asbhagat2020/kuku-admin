// components/UsersConversationThread.jsx
import React from 'react';
import { format } from 'date-fns';
import { FaUser, FaPaperPlane, FaEnvelope } from 'react-icons/fa';

const UsersConversationThread = ({
  selectedComplaint,
  replyMessage,
  setReplyMessage,
  sendingReply,
  onSendReply
}) => {
  if (!selectedComplaint) {
    return (
      <div className="flex-1 flex items-center justify-center p-10 text-gray-400">
        <FaEnvelope className="mx-auto text-9xl mb-6 opacity-20" />
        <p className="text-2xl font-bold">Select a ticket</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {(selectedComplaint.messages || []).map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-sm p-5 rounded-3xl shadow-lg ${
              msg.sender === 'user'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <FaUser className="text-sm" />
                <span className="font-bold text-xs opacity-80">
                  {msg.sender === 'user' ? 'Customer' : 'Support'}
                </span>
                <span className="text-xs opacity-60">
                  {msg.sentAt ? format(new Date(msg.sentAt), 'hh:mm a') : 'N/A'}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm">{msg.message || 'No text'}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t-4 border-pink-100">
        <textarea
          rows="5"
          placeholder="Write your reply... User gets email"
          className="w-full p-4 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-600 focus:ring-4 focus:ring-pink-100 resize-none text-lg"
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
        />
        <button
          onClick={onSendReply}
          disabled={sendingReply || !replyMessage.trim()}
          className="mt-4 w-full bg-gradient-to-r from-pink-600 to-pink-700 text-white py-5 rounded-2xl font-bold text-xl hover:from-pink-700 hover:to-pink-800 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {sendingReply ? 'Sending...' : <> <FaPaperPlane /> Send & Close Ticket </>}
        </button>
      </div>
    </>
  );
};

export default UsersConversationThread;