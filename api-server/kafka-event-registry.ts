// ==================== events/schemas/deployment.schema.ts ====================

import { z } from 'zod';

export const DeploymentLogEventSchema = z.object({
  deploymentId: z.string(),
  projectId: z.string(),
  logs: z.array(z.object({
    timestamp: z.string().datetime(),
    level: z.enum(['INFO', 'WARN', 'ERROR', 'DEBUG']),
    message: z.string(),
    source: z.string().optional()
  })),
  metadata: z.record(z.unknown()).optional()
});

export const DeploymentStatusEventSchema = z.object({
  deploymentId: z.string(),
  projectId: z.string(),
  status: z.enum(['QUEUED', 'BUILDING', 'DEPLOYING', 'READY', 'ERROR', 'CANCELED']),
  previousStatus: z.enum(['QUEUED', 'BUILDING', 'DEPLOYING', 'READY', 'ERROR', 'CANCELED']).optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    stack: z.string().optional()
  }).optional(),
  timestamp: z.string().datetime()
});

export const BuildMetricsEventSchema = z.object({
  deploymentId: z.string(),
  projectId: z.string(),
  metrics: z.object({
    buildTime: z.number(),
    installTime: z.number(),
    totalSize: z.number(),
    lambdaCount: z.number().optional()
  }),
  timestamp: z.string().datetime()
});

export type DeploymentLogEvent = z.infer<typeof DeploymentLogEventSchema>;
export type DeploymentStatusEvent = z.infer<typeof DeploymentStatusEventSchema>;
export type BuildMetricsEvent = z.infer<typeof BuildMetricsEventSchema>;

// ==================== events/schemas/analytics.schema.ts ====================

export const PageViewEventSchema = z.object({
  deploymentId: z.string(),
  projectId: z.string(),
  path: z.string(),
  userAgent: z.string().optional(),
  ip: z.string().optional(),
  timestamp: z.string().datetime()
});

export const FunctionInvocationEventSchema = z.object({
  deploymentId: z.string(),
  projectId: z.string(),
  functionName: z.string(),
  duration: z.number(),
  statusCode: z.number(),
  timestamp: z.string().datetime()
});

export type PageViewEvent = z.infer<typeof PageViewEventSchema>;
export type FunctionInvocationEvent = z.infer<typeof FunctionInvocationEventSchema>;

// ==================== events/handlers/deployment.handler.ts ====================

import { deploymentService } from '../../instances.js';
import {
  DeploymentLogEvent,
  DeploymentStatusEvent,
  BuildMetricsEvent
} from '../schemas/deployment.schema.js';

export class DeploymentEventHandler {
  /**
   * Handle deployment logs from Kafka
   */
  static async handleLogs(event: DeploymentLogEvent): Promise<void> {
    console.log(`[DeploymentLogs] Processing ${event.logs.length} logs for ${event.deploymentId}`);
    
    await deploymentService.appendLogs(
      event.deploymentId,
      event.logs
    );
    
    console.log(`✅ [DeploymentLogs] Saved logs for ${event.deploymentId}`);
  }

  /**
   * Handle deployment status changes
   */
  static async handleStatusChange(event: DeploymentStatusEvent): Promise<void> {
    console.log(`[DeploymentStatus] ${event.deploymentId}: ${event.previousStatus || 'INIT'} → ${event.status}`);
    
    await deploymentService.updateDeploymentStatus(
      event.deploymentId,
      event.status,
      event.error
    );

    // Trigger notifications if status is READY or ERROR
    if (event.status === 'READY' || event.status === 'ERROR') {
      // Could emit another event here for notifications
      console.log(`📧 [DeploymentStatus] Notification triggered for ${event.deploymentId}`);
    }
    
    console.log(`✅ [DeploymentStatus] Updated ${event.deploymentId} to ${event.status}`);
  }

  /**
   * Handle build metrics
   */
  static async handleBuildMetrics(event: BuildMetricsEvent): Promise<void> {
    console.log(`[BuildMetrics] Processing metrics for ${event.deploymentId}`);
    
    await deploymentService.saveBuildMetrics(
      event.deploymentId,
      event.metrics
    );
    
    console.log(`✅ [BuildMetrics] Saved metrics for ${event.deploymentId}`);
  }
}

// ==================== events/handlers/analytics.handler.ts ====================

import { analyticsService } from '../../instances.js';
import {
  PageViewEvent,
  FunctionInvocationEvent
} from '../schemas/analytics.schema.js';

export class AnalyticsEventHandler {
  /**
   * Handle page view tracking
   */
  static async handlePageView(event: PageViewEvent): Promise<void> {
    console.log(`[Analytics] Page view: ${event.path} on ${event.deploymentId}`);
    
    await analyticsService.trackPageView({
      deploymentId: event.deploymentId,
      projectId: event.projectId,
      path: event.path,
      userAgent: event.userAgent,
      ip: event.ip,
      timestamp: new Date(event.timestamp)
    });
    
    console.log(`✅ [Analytics] Tracked page view for ${event.deploymentId}`);
  }

  /**
   * Handle function invocation metrics
   */
  static async handleFunctionInvocation(event: FunctionInvocationEvent): Promise<void> {
    console.log(`[Analytics] Function ${event.functionName} invoked: ${event.duration}ms`);
    
    await analyticsService.trackFunctionInvocation({
      deploymentId: event.deploymentId,
      projectId: event.projectId,
      functionName: event.functionName,
      duration: event.duration,
      statusCode: event.statusCode,
      timestamp: new Date(event.timestamp)
    });
    
    console.log(`✅ [Analytics] Tracked function invocation for ${event.deploymentId}`);
  }
}

// ==================== events/registry.ts ====================

import { ZodSchema } from 'zod';
import { DeploymentEventHandler } from './handlers/deployment.handler.js';
import { AnalyticsEventHandler } from './handlers/analytics.handler.js';
import {
  DeploymentLogEventSchema,
  DeploymentStatusEventSchema,
  BuildMetricsEventSchema
} from './schemas/deployment.schema.js';
import {
  PageViewEventSchema,
  FunctionInvocationEventSchema
} from './schemas/analytics.schema.js';

/**
 * Event handler function type
 */
type EventHandler<T = any> = (event: T) => Promise<void>;

/**
 * Event configuration
 */
interface EventConfig {
  topic: string;
  schema: ZodSchema;
  handler: EventHandler;
  description?: string;
}

/**
 * Central event registry - Single source of truth
 * Add new events here and they're automatically consumed
 */
export const EVENT_REGISTRY: Record<string, EventConfig> = {
  // Deployment Events
  'deployment.logs': {
    topic: 'deployment.logs',
    schema: DeploymentLogEventSchema,
    handler: DeploymentEventHandler.handleLogs,
    description: 'Real-time deployment build logs'
  },
  
  'deployment.status': {
    topic: 'deployment.status',
    schema: DeploymentStatusEventSchema,
    handler: DeploymentEventHandler.handleStatusChange,
    description: 'Deployment status transitions'
  },
  
  'deployment.metrics': {
    topic: 'deployment.metrics',
    schema: BuildMetricsEventSchema,
    handler: DeploymentEventHandler.handleBuildMetrics,
    description: 'Build performance metrics'
  },
  
  // Analytics Events
  'analytics.pageview': {
    topic: 'analytics.pageview',
    schema: PageViewEventSchema,
    handler: AnalyticsEventHandler.handlePageView,
    description: 'User page view tracking'
  },
  
  'analytics.function': {
    topic: 'analytics.function',
    schema: FunctionInvocationEventSchema,
    handler: AnalyticsEventHandler.handleFunctionInvocation,
    description: 'Serverless function invocations'
  }
};

/**
 * Get all topics from registry
 */
export function getAllTopics(): string[] {
  return Object.values(EVENT_REGISTRY).map(config => config.topic);
}

/**
 * Get event config by topic
 */
export function getEventConfig(topic: string): EventConfig | undefined {
  return EVENT_REGISTRY[topic];
}

/**
 * Validate and handle event
 */
export async function processEvent(topic: string, data: unknown): Promise<void> {
  const config = getEventConfig(topic);
  
  if (!config) {
    throw new Error(`No handler registered for topic: ${topic}`);
  }
  
  // Validate event data with Zod
  const validatedData = config.schema.parse(data);
  
  // Execute handler
  await config.handler(validatedData);
}

// ==================== events/consumer.ts ====================

import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { processEvent, getAllTopics } from './registry.js';

export class KafkaEventConsumer {
  private kafka: Kafka;
  private consumer: Consumer;
  private isRunning = false;

  constructor(brokers: string[], groupId: string) {
    this.kafka = new Kafka({
      clientId: 'vercel-clone',
      brokers
    });
    
    this.consumer = this.kafka.consumer({ groupId });
  }

  /**
   * Start consuming all registered events
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('⚠️  Kafka consumer already running');
      return;
    }

    try {
      await this.consumer.connect();
      console.log('🔌 Kafka consumer connected');

      const topics = getAllTopics();
      await this.consumer.subscribe({ topics });
      console.log(`📡 Subscribed to ${topics.length} topics:`, topics);

      await this.consumer.run({
        eachMessage: this.handleMessage.bind(this)
      });

      this.isRunning = true;
      console.log('✅ Kafka consumer started successfully');
    } catch (error) {
      console.error('❌ Failed to start Kafka consumer:', error);
      throw error;
    }
  }

  /**
   * Handle incoming Kafka message
   */
  private async handleMessage({ topic, partition, message }: EachMessagePayload): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Parse message
      const data = JSON.parse(message.value?.toString() || '{}');
      
      console.log(`📨 [${topic}] Received event at partition ${partition}`);
      
      // Process through registry
      await processEvent(topic, data);
      
      const duration = Date.now() - startTime;
      console.log(`⚡ [${topic}] Processed in ${duration}ms`);
      
    } catch (error) {
      console.error(`❌ [${topic}] Error processing event:`, error);
      
      // Send to Dead Letter Queue (DLQ)
      await this.sendToDLQ(topic, message.value?.toString() || '', error);
    }
  }

  /**
   * Send failed messages to Dead Letter Queue
   */
  private async sendToDLQ(topic: string, messageValue: string, error: any): Promise<void> {
    try {
      const producer = this.kafka.producer();
      await producer.connect();
      
      await producer.send({
        topic: `${topic}.dlq`,
        messages: [{
          value: JSON.stringify({
            originalTopic: topic,
            message: messageValue,
            error: error.message,
            timestamp: new Date().toISOString()
          })
        }]
      });
      
      await producer.disconnect();
      console.log(`📤 [DLQ] Sent failed message from ${topic} to DLQ`);
    } catch (dlqError) {
      console.error('❌ [DLQ] Failed to send to DLQ:', dlqError);
    }
  }

  /**
   * Graceful shutdown
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    try {
      await this.consumer.disconnect();
      this.isRunning = false;
      console.log('👋 Kafka consumer stopped');
    } catch (error) {
      console.error('❌ Error stopping Kafka consumer:', error);
      throw error;
    }
  }

  /**
   * Check if consumer is running
   */
  isActive(): boolean {
    return this.isRunning;
  }
}

// ==================== events/index.ts ====================

import { KafkaEventConsumer } from './consumer.js';

let consumerInstance: KafkaEventConsumer | null = null;

/**
 * Initialize and start Kafka consumer
 */
export async function startKafkaConsumer(): Promise<void> {
  const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
  const groupId = process.env.KAFKA_GROUP_ID || 'vercel-clone-group';
  
  consumerInstance = new KafkaEventConsumer(brokers, groupId);
  await consumerInstance.start();
}

/**
 * Stop Kafka consumer
 */
export async function stopKafkaConsumer(): Promise<void> {
  if (consumerInstance) {
    await consumerInstance.stop();
    consumerInstance = null;
  }
}

/**
 * Get consumer instance
 */
export function getConsumerInstance(): KafkaEventConsumer | null {
  return consumerInstance;
}

export * from './registry.js';
export * from './schemas/deployment.schema.js';
export * from './schemas/analytics.schema.js';

// ==================== app.ts ====================

import express from 'express';
import { startKafkaConsumer, stopKafkaConsumer } from './events/index.js';
import projectRoutes from './routes/project.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/projects', projectRoutes);

/**
 * Start Express server and Kafka consumer
 */
async function bootstrap() {
  try {
    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 HTTP Server running on port ${PORT}`);
    });

    // Start Kafka consumer
    await startKafkaConsumer();
    
    console.log('✅ Application started successfully');
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
async function shutdown(signal: string) {
  console.log(`\n${signal} received, shutting down gracefully...`);
  
  try {
    await stopKafkaConsumer();
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
}

// Handle shutdown signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Start application
bootstrap();

// ==================== USAGE EXAMPLES ====================

/*
// Adding a new event is simple - just update registry!

// 1. Create schema
// events/schemas/notification.schema.ts
export const EmailEventSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  body: z.string()
});

// 2. Create handler
// events/handlers/notification.handler.ts
export class NotificationEventHandler {
  static async handleEmail(event: EmailEvent) {
    await emailService.send(event);
  }
}

// 3. Register in events/registry.ts
'notification.email': {
  topic: 'notification.email',
  schema: EmailEventSchema,
  handler: NotificationEventHandler.handleEmail
}

// That's it! Consumer automatically picks it up 🎉

// Testing a handler
import { DeploymentEventHandler } from './events/handlers/deployment.handler';

const mockEvent = {
  deploymentId: '123',
  projectId: '456',
  logs: [{ timestamp: new Date().toISOString(), level: 'INFO', message: 'Test' }]
};

await DeploymentEventHandler.handleLogs(mockEvent);
*/