import {projectPlan} from '../lib/project-plan.mjs';
export default function ProjectPlan({data}:{data:Record<string,string>}){
 const plan=projectPlan(data);if(!plan)return null;
 return <section className="project-plan" aria-labelledby="project-plan-title">
  <div className="project-plan-head"><div><div className="eyebrow">Votre plan de projet</div><h3 id="project-plan-title">Votre projet et les prochaines étapes.</h3></div><span>03</span></div>
  <p>{plan.notice}</p>
  <div className="project-readiness"><div><span>Niveau de préparation déclaré</span><strong>{plan.readiness.label}</strong></div><div className="project-readiness-track" role="progressbar" aria-label="Repères de préparation renseignés" aria-valuemin={0} aria-valuemax={plan.readiness.total} aria-valuenow={plan.readiness.score}><i style={{width:`${plan.readiness.score/plan.readiness.total*100}%`}}/></div><p>{plan.readiness.score}/{plan.readiness.total} repères renseignés · {plan.readiness.summary}</p></div>
  <div className="project-plan-grid">{plan.sections.map(section=><article key={section.id}><span className="project-plan-number">{section.number}</span><h4>{section.title}</h4><ul>{section.items.map((item:string)=><li key={item}>{item}</li>)}</ul></article>)}</div>
 </section>;
}
