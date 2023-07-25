import { useSuspense } from "@src/api-provider/use-suspense";
import OpenAiService from "@src/services/open-ai-service";
import { dotProduct } from "@src/utils/math-utils";

import MockJiraTickets from "@src/mocks/mock-jira-tickets";

export const GithubHelper = () => {
  const explainedCode = useSuspense(OpenAiService.explainCode, [
    {
      code: "let btn = document.createElement('button'); btn.addEventListener('click', function() { window.location.href = '/about'; }); document.body.appendChild(btn); ",
    },
  ]);

  const CodeEmbedding = useSuspense(OpenAiService.getEmbedding, [
    {
      input: explainedCode.description,
    },
  ]);

  const JiraTicketEmbeddingsPromise = Promise.all(
    MockJiraTickets.map((ticket) =>
      OpenAiService.getEmbedding({ input: ticket.description })
    )
  );

  const JiraTicketEmbeddings = useSuspense(
    () => JiraTicketEmbeddingsPromise,
    []
  );

  console.log(
    JiraTicketEmbeddings.map((embedding) =>
      dotProduct(embedding, CodeEmbedding)
    )
  );
};
