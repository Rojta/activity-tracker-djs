import mongoose, { Schema } from "mongoose";

export interface Activity {
  versionId?: number;
  name?: string;
  type?: number;
  url?: string;
  details?: string;
  state?: string;
  applicationId?: string;
  party?: {
    id?: number;
    size?: {
      current?: number;
      max?: number;
    };
  };
  assets?: {
    largeImageUrl?: string;
    largeImageId?: string;
    largeText?: string;
    smallImageUrl?: string;
    smallImageId?: string;
    smallText?: string;
  };
  buttons?: [];
  timestamps?: {
    start?: Date;
    end?: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const activitySchema = new Schema<Activity>(
  {
    versionId: {
      type: Number,
      default: 1,
    },
    name: {
      type: String,
      default: null,
    },
    type: {
      type: Number,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
    details: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    applicationId: {
      type: String,
      default: null,
    },
    party: {
      id: {
        type: Number,
        default: null,
      },
      size: {
        current: {
          type: Number,
          default: null,
        },
        max: {
          type: Number,
          default: null,
        },
      },
    },
    assets: {
      largeImageUrl: {
        type: String,
        default: null,
      },
      largeImageId: {
        type: String,
        default: null,
      },
      largeText: {
        type: String,
        default: null,
      },
      smallImageUrl: {
        type: String,
        default: null,
      },
      smallImageId: {
        type: String,
        default: null,
      },
      smallText: {
        type: String,
        default: null,
      },
    },
    buttons: Array,
    timestamps: {
      start: {
        type: Date,
        default: null,
      },
      end: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true }
);

export default (mongoose.models.Activity as mongoose.Model<Activity>) ||
  mongoose.model("Activity", activitySchema);
