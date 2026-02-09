const ARTIFACT_TAG_OPEN = "<boltArtifact";
const ARTIFACT_TAG_CLOSE = "</boltArtifact>";
const ARTIFACT_ACTION_TAG_OPEN = "<boltAction";
const ARTIFACT_ACTION_TAG_CLOSE = "</boltAction>";

export const parseGithub = (input: string) => {
  let state = {
    position: 0,
    insideAction: false,
    insideArtifact: false,
    currentAction: { content: "" },
    actionId: 0,
  };

  // For long inputs, use a more efficient processing method
  return parseImpl(state, "test", input);
};
const parseImpl = (state: any, messageId: string, input: string) => {
  let output = "";
  let i = state.position;
  let earlyBreak = false;
  const files: any[] = [];
  // Pre-allocate buffer to reduce string concatenation operations

  // Batch processing threshold, check whether to yield the main thread after processing this many characters
  const BATCH_SIZE = 5000;
  let processedChars = 0;

  while (i < input.length) {
    // Check if we need to yield the main thread after processing a certain amount of characters
    if (processedChars > BATCH_SIZE) {
      processedChars = 0;
      // If requestIdleCallback is available, use it to yield the main thread
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        break; // Exit the loop early and continue next time
      }
    }

    if (state.insideArtifact) {
      const currentArtifact = state.currentArtifact;

      if (currentArtifact === undefined) {
        // unreachable('Artifact not initialized');
      }

      if (state.insideAction) {
        const closeIndex = input.indexOf(ARTIFACT_ACTION_TAG_CLOSE, i);

        const currentAction = state.currentAction;

        if (closeIndex !== -1) {
          // Use substring instead of slice for better performance
          currentAction.content += input.substring(i, closeIndex);

          let content = currentAction.content.trim();

          if ("type" in currentAction && currentAction.type === "file") {
            // Use cache to avoid repetitive processing of the same content
            if (!currentAction.filePath.endsWith(".md")) {
              content = cleanoutMarkdownSyntax(content);
              content = cleanEscapedTags(content);
            }
            content += "\n";
          }

          currentAction.content = content;
          console.log(currentAction);
          files.push({ ...currentAction });
          // this._options.callbacks?.onActionClose?.({
          //   artifactId: currentArtifact.id,
          //   messageId,

          //   /**
          //    * We decrement the id because it's been incremented already
          //    * when `onActionOpen` was emitted to make sure the ids are
          //    * the same.
          //    */
          //   actionId: String(state.actionId - 1),

          //   action: currentAction as any,
          // });

          state.insideAction = false;
          state.currentAction = { content: "" };

          i = closeIndex + ARTIFACT_ACTION_TAG_CLOSE.length;
          processedChars += closeIndex - i + ARTIFACT_ACTION_TAG_CLOSE.length;
        } else {
          if ("type" in currentAction && currentAction.type === "file") {
            // Use substring instead of slice for better performance
            let content = input.substring(i);

            if (!currentAction.filePath.endsWith(".md")) {
              content = cleanoutMarkdownSyntax(content);
              content = cleanEscapedTags(content);
            }

            //   this._options.callbacks?.onActionStream?.({
            //     artifactId: currentArtifact.id,
            //     messageId,
            //     actionId: String(state.actionId - 1),
            //     action: {
            //       ...(currentAction as any),
            //       content,
            //       filePath: currentAction.filePath,
            //     },
            //   });
          }

          if ("type" in currentAction && currentAction.type === "shell") {
            //   this._options.callbacks?.onActionStream?.({
            //     artifactId: currentArtifact.id,
            //     messageId,
            //     actionId: String(state.actionId - 1),
            //     action: currentAction as any,
            //   });
          }

          break;
        }
      } else {
        const actionOpenIndex = input.indexOf(ARTIFACT_ACTION_TAG_OPEN, i);
        const artifactCloseIndex = input.indexOf(ARTIFACT_TAG_CLOSE, i);

        if (
          actionOpenIndex !== -1 &&
          (artifactCloseIndex === -1 || actionOpenIndex < artifactCloseIndex)
        ) {
          const actionEndIndex = input.indexOf(">", actionOpenIndex);

          if (actionEndIndex !== -1) {
            state.insideAction = true;

            state.currentAction = parseActionTag(
              input,
              actionOpenIndex,
              actionEndIndex
            );

            //   this._options.callbacks?.onActionOpen?.({
            //     artifactId: currentArtifact.id,
            //     messageId,
            //     actionId: String(state.actionId++),
            //     action: state.currentAction as any,
            //   });

            i = actionEndIndex + 1;
          } else {
            break;
          }
        } else if (artifactCloseIndex !== -1) {
          // this._options.callbacks?.onArtifactClose?.({ messageId, ...currentArtifact });

          state.insideArtifact = false;
          state.currentArtifact = undefined;

          i = artifactCloseIndex + ARTIFACT_TAG_CLOSE.length;
        } else {
          break;
        }
      }
    } else if (input[i] === "<" && input[i + 1] !== "/") {
      let j = i;
      let potentialTag = "";
      console.log(potentialTag);
      while (
        j < input.length &&
        potentialTag.length < ARTIFACT_TAG_OPEN.length
      ) {
        potentialTag += input[j];

        if (potentialTag === ARTIFACT_TAG_OPEN) {
          const nextChar = input[j + 1];

          if (nextChar && nextChar !== ">" && nextChar !== " ") {
            output += input.slice(i, j + 1);
            i = j + 1;
            break;
          }

          const openTagEnd = input.indexOf(">", j);

          if (openTagEnd !== -1) {
            const artifactTag = input.slice(i, openTagEnd + 1);

            const artifactTitle = extractAttribute(
              artifactTag,
              "title"
            ) as string;
            const type = extractAttribute(artifactTag, "type") as string;
            const artifactId = extractAttribute(artifactTag, "id") as string;

            if (!artifactTitle) {
              // console.error('Artifact title missing');
            }

            if (!artifactId) {
              // console.error('Artifact id missing');
            }

            state.insideArtifact = true;

            const currentArtifact = {
              id: artifactId,
              title: artifactTitle,
              type,
            };

            state.currentArtifact = currentArtifact;

            // this._options.callbacks?.onArtifactOpen?.({ messageId, ...currentArtifact });

            const artifactFactory = createArtifactElement;

            output += artifactFactory({ messageId });

            i = openTagEnd + 1;
          } else {
            earlyBreak = true;
          }

          break;
        } else if (!ARTIFACT_TAG_OPEN.startsWith(potentialTag)) {
          output += input.slice(i, j + 1);
          i = j + 1;
          break;
        }

        j++;
      }

      if (j === input.length && ARTIFACT_TAG_OPEN.startsWith(potentialTag)) {
        break;
      }
    } else {
      output += input[i];
      i++;
    }

    if (earlyBreak) {
      break;
    }
  }

  state.position = i;

  return { output, files };
};

function cleanoutMarkdownSyntax(content: string) {
  const codeBlockRegex = /^\s*```\w*\n([\s\S]*?)\n\s*```\s*$/;
  const match = content.match(codeBlockRegex);

  // console.log('matching', !!match, content);

  if (match) {
    return match[1]; // Remove common leading 4-space indent
  } else {
    return content;
  }
}

function cleanEscapedTags(content: string) {
  return content.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

const createArtifactElement = (props) => {
  const elementProps = [
    'class="__boltArtifact__"',
    ...Object.entries(props).map(([key, value]) => {
      return `data-${camelToDashCase(key)}=${JSON.stringify(value)}`;
    }),
  ];

  return `<div ${elementProps.join(" ")}></div>`;
};

function camelToDashCase(input: string) {
  return input.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

const parseActionTag = (
  input: string,
  actionOpenIndex: number,
  actionEndIndex: number
) => {
  const actionTag = input.slice(actionOpenIndex, actionEndIndex + 1);

  const actionType = extractAttribute(actionTag, "type") as any;

  const actionAttributes = {
    type: actionType,
    content: "",
  };

  if (actionType === "file") {
    const filePath = extractAttribute(actionTag, "filePath") as string;

    if (!filePath) {
      console.error("File path not specified");
    }

    (actionAttributes as any).filePath = filePath;
  } else if (!["shell", "start"].includes(actionType)) {
    console.error(`Unknown action type '${actionType}'`);
  }

  return actionAttributes as any;
};

const extractAttribute = (
  tag: string,
  attributeName: string
): string | undefined => {
  const match = tag.match(new RegExp(`${attributeName}="([^"]*)"`, "i"));
  return match ? match[1] : undefined;
};
