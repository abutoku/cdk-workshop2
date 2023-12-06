#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkWorkshop2Stack } from '../lib/cdk-workshop2-stack';

const app = new cdk.App();
new CdkWorkshop2Stack(app, 'CdkWorkshop2Stack');
