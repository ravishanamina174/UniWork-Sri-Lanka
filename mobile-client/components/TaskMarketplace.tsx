import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link } from 'expo-router';

export interface TaskGig {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills_required: string[];
  task_type?: 'remote' | 'on-site';
  location?: {
    type: string;
    coordinates: [number, number];
    address: string;
  };
}

interface TaskMarketplaceProps {
  tasks: TaskGig[];
  embedded?: boolean;
  userRole?: string;
}

interface CategoryBadge {
  label: string;
  backgroundColor: string;
  textColor: string;
}

interface SkillBadgeColor {
  backgroundColor: string;
  textColor: string;
}

const SKILL_COLORS: SkillBadgeColor[] = [
  { backgroundColor: '#4285F4', textColor: '#FFFFFF' },
  { backgroundColor: '#34A853', textColor: '#FFFFFF' },
  { backgroundColor: '#FBBC05', textColor: '#0F172A' },
  { backgroundColor: '#EA4335', textColor: '#FFFFFF' },
  { backgroundColor: '#673AB7', textColor: '#FFFFFF' },
];

function getCategoryBadge(title: string, skills: string[]): CategoryBadge {
  const text = (title + skills.join(' ')).toLowerCase();

  if (
    text.includes('design') ||
    text.includes('ui') ||
    text.includes('ux') ||
    text.includes('figma')
  ) {
    return { label: 'UI/UX Design', backgroundColor: '#EAFAEA', textColor: '#2E7D32' };
  }

  if (
    text.includes('move') ||
    text.includes('delivery') ||
    text.includes('flyer') ||
    text.includes('physical')
  ) {
    return { label: 'On-Campus Task', backgroundColor: '#FFF3E0', textColor: '#E65100' };
  }

  return { label: 'Software & Tech', backgroundColor: '#E8F0FE', textColor: '#1A73E8' };
}

function getSkillBadgeColor(index: number): SkillBadgeColor {
  return SKILL_COLORS[index % SKILL_COLORS.length];
}

function formatBudget(budget: number): string {
  return `LKR ${budget.toLocaleString()}`;
}

function MarketplaceHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Quick Gigs & On-Campus Tasks</Text>
      <Text style={styles.subtitle}>
        Grab a task, deliver the work, get paid directly, and level up your profile.
      </Text>
    </View>
  );
}

function TaskCard({ task, userRole }: { task: TaskGig; userRole?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const category = getCategoryBadge(task.title, task.skills_required);
  const isRemote = task.task_type === 'remote';

  return (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <View style={[styles.categoryBadge, { backgroundColor: category.backgroundColor }]}>
            <Text style={[styles.categoryBadgeText, { color: category.textColor }]}>
              {category.label}
            </Text>
          </View>
          <Text style={styles.deadline}>📅 {task.deadline}</Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.taskTitle} numberOfLines={2}>
            {task.title}
          </Text>
          <Text style={styles.budget}>{formatBudget(task.budget)}</Text>
        </View>

        {/* Location Block */}
        <View style={styles.locationBadgeContainer}>
          {isRemote ? (
            <>
              <Text style={styles.locationIcon}>🌐</Text>
              <Text style={styles.locationText}>Remote Task</Text>
            </>
          ) : (
            <>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {task.location?.address || 'Location specified on map'}
              </Text>
            </>
          )}
        </View>

        {/* Description & See More Toggle */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description} numberOfLines={isExpanded ? undefined : 3}>
            {task.description}
          </Text>
          {task.description && task.description.length > 120 && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} activeOpacity={0.6}>
              <Text style={styles.seeMoreText}>
                {isExpanded ? 'see less' : 'see more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.skillsRow}>
          {task.skills_required.length === 0 ? (
            <Text style={styles.generalTask}>General Task</Text>
          ) : (
            task.skills_required.map((skill, index) => {
              const colors = getSkillBadgeColor(index);
              return (
                <View
                  key={`${task.id}-${skill}-${index}`}
                  style={[styles.skillBadge, { backgroundColor: colors.backgroundColor }]}
                >
                  <Text style={[styles.skillBadgeText, { color: colors.textColor }]}>
                    {skill}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </View>

      {userRole === 'STUDENT_EARNER' && (
        <View style={styles.cardFooter}>
          <Link href={`/task-req/${task.id}`} asChild>
            <TouchableOpacity style={styles.exploreButton} activeOpacity={0.7}>
              <Text style={styles.exploreButtonText}>Request Task</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        No task entries active. Tasks posted will sync automatically here.
      </Text>
    </View>
  );
}

export default function TaskMarketplace({ tasks, embedded = false, userRole }: TaskMarketplaceProps) {
  const [visibleCount, setVisibleCount] = useState(3);

  const visibleTasks = tasks.slice(0, visibleCount);

  const renderLoadMoreButton = () => {
    if (visibleCount >= tasks.length) return null;
    return (
      <View style={styles.loadMoreContainer}>
        <TouchableOpacity
          style={styles.loadMoreButton}
          activeOpacity={0.7}
          onPress={() => setVisibleCount((prev) => prev + 3)}
        >
          <Text style={styles.loadMoreButtonText}>Load More Tasks</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (embedded) {
    return (
      <View style={styles.container}>
        <MarketplaceHeader />
        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {visibleTasks.map((task) => (
              <TaskCard key={task.id} task={task} userRole={userRole} />
            ))}
            {renderLoadMoreButton()}
          </>
        )}
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.container}>
        <MarketplaceHeader />
        <EmptyState />
      </View>
    );
  }

  return (
    <FlatList
      data={visibleTasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TaskCard task={item} userRole={userRole} />}
      ListHeaderComponent={MarketplaceHeader}
      ListFooterComponent={renderLoadMoreButton}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 96,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 96,
  },
  header: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.6)',
    paddingTop: 48,
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#989A9C',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 24,
  },
  cardBody: {
    padding: 24,
    paddingBottom: 16,
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  deadline: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  titleBlock: {
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
    minHeight: 44,
  },
  budget: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '900',
    color: '#007FFF',
    letterSpacing: -0.3,
  },
  locationBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    maxWidth: '100%',
    marginBottom: 16,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
    flexShrink: 1,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  description: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  seeMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 4,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 8,
  },
  generalTask: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  skillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
  },
  skillBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardFooter: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
  },
  exploreButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  exploreButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#191919',
    letterSpacing: 0.3,
  },
  loadMoreContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadMoreButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 24,
  },
  loadMoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191919',
    letterSpacing: 0.3,
  },
});