import {test} from 'node:test';
import assert from 'node:assert/strict';
import {contactPreferenceFor,nextStepAction,nextStepLabel,resolveNextStep} from '../lib/next-step.mjs';

test('la suite choisie pilote clairement la relance CRM',()=>{
 assert.equal(contactPreferenceFor({nextStep:'self_guided'}),'not_requested');
 assert.equal(contactPreferenceFor({nextStep:'human_review'}),'requested');
 assert.equal(contactPreferenceFor({nextStep:'scoped_mission'}),'requested');
 assert.match(nextStepAction({nextStep:'scoped_mission'}),/proposition de mission cadrée/);
 assert.equal(nextStepLabel({nextStep:'human_review'}),'Demander un premier examen humain');
});

test('les anciennes demandes restent compatibles',()=>{
 assert.equal(resolveNextStep({contactPreference:'not_requested'}),'self_guided');
 assert.equal(resolveNextStep({contactPreference:'requested'}),'human_review');
 assert.equal(resolveNextStep({}),'human_review');
});
