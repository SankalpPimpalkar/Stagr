
// Generate random positions around a center
const getClusteredPosition = (centerX, centerY, radius = 200) => {
    const angle = Math.random() * 2 * Math.PI;
    const r = Math.sqrt(Math.random()) * radius;
    return {
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle),
    };
};

export const getExploreGraphData = () => {
    const nodes = [];
    const edges = [];

    // Clusters centers
    const clusters = [
        { id: 'c1', x: 0, y: 0, label: 'Technology' },
        { id: 'c2', x: 600, y: -200, label: 'Design' },
        { id: 'c3', x: -500, y: 400, label: 'Philosophy' },
        { id: 'c4', x: 400, y: 500, label: 'Science' },
    ];

    // Create central Topic nodes for clusters
    clusters.forEach(cluster => {
        nodes.push({
            id: `topic_${cluster.id}`,
            type: 'topic',
            position: { x: cluster.x, y: cluster.y },
            data: { label: cluster.label, importance: 'high' }
        });
    });

    // Create Stories and Tags around clusters
    clusters.forEach(cluster => {
        const storiesCount = 5 + Math.floor(Math.random() * 5); // 5-10 stories per cluster

        for (let i = 0; i < storiesCount; i++) {
            const storyId = `story_${cluster.id}_${i}`;
            const storyPos = getClusteredPosition(cluster.x, cluster.y, 300);

            nodes.push({
                id: storyId,
                type: 'story',
                position: storyPos,
                data: { label: `Story ${cluster.id}-${i}` }
            });

            // Edge from Story to Cluster Topic
            edges.push({
                id: `e_${storyId}_${cluster.id}`,
                source: storyId,
                target: `topic_${cluster.id}`,
                type: 'default',
                animated: false,
            });

            // Create some tags for each story
            const tagsCount = 1 + Math.floor(Math.random() * 3); // 1-3 tags per story
            for (let j = 0; j < tagsCount; j++) {
                const tagId = `tag_${storyId}_${j}`;
                // Tag closer to story
                const tagPos = getClusteredPosition(storyPos.x, storyPos.y, 80);

                nodes.push({
                    id: tagId,
                    type: 'tag',
                    position: tagPos,
                    data: { label: `Tag ${j}` }
                });

                // Edge from Tag to Story
                edges.push({
                    id: `e_${tagId}_${storyId}`,
                    source: tagId,
                    target: storyId,
                    type: 'default',
                });
            }
        }
    });

    // Create some cross-cluster connections (random edges between stories of different clusters)
    const storyNodes = nodes.filter(n => n.type === 'story');
    for (let i = 0; i < 5; i++) {
        const source = storyNodes[Math.floor(Math.random() * storyNodes.length)];
        const target = storyNodes[Math.floor(Math.random() * storyNodes.length)];

        if (source.id !== target.id) {
            edges.push({
                id: `e_cross_${i}`,
                source: source.id,
                target: target.id,
                type: 'default',
                animated: true,
                style: { strokeOpacity: 0.2 }
            });
        }
    }

    return { nodes, edges };
};
